#!/usr/bin/env node
/**
 * Content Check Script
 * Pre-publish validation to prevent app-specific or forbidden content from being published
 *
 * Usage: node scripts/content-check.js
 * Add to package.json: "prepublishOnly": "npm run content-check && npm run typecheck"
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const FORBIDDEN_PATTERNS = [
  // Intimate/Romantic Content (App Store Guideline 1.1)
  { pattern: /ai[-_]?hug/gi, description: 'AI Hug reference' },
  { pattern: /ai[-_]?kiss/gi, description: 'AI Kiss reference' },
  { pattern: /\bintimate\b/gi, description: 'Intimate content' },
  { pattern: /\bromantic\b/gi, description: 'Romantic content' },
  { pattern: /couple[-_]?future/gi, description: 'Couple Future reference' },
  { pattern: /hug[-_]?video/gi, description: 'Hug Video reference' },
  { pattern: /kiss[-_]?video/gi, description: 'Kiss Video reference' },
  { pattern: /\bINTIMATE\b/g, description: 'INTIMATE category' },

  // Couple-related (except code identifiers like CoupleFeature)
  { pattern: /couple[-_]scenario/gi, description: 'Couple Scenario reference' },
  { pattern: /romantic[-_]mood/gi, description: 'Romantic Mood reference' },

  // App-specific scenario names that shouldn't be in package
  { pattern: /fantasy[-_]couple/gi, description: 'Fantasy Couple scenario' },
  { pattern: /wedding[-_]couple/gi, description: 'Wedding Couple scenario' },
  { pattern: /love[-_]story/gi, description: 'Love Story scenario' },
];

// Patterns that are OK in code but not in user-facing content
const CODE_ALLOWED_PATTERNS = [
  'CoupleFeature', // Class/type name
  'coupleRef',     // Variable name
  'imageCoupleMultiRef', // Model config key
];

// File extensions to scan
const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md'];

// Directories to skip
const SKIP_DIRECTORIES = ['node_modules', 'dist', 'build', '.git', 'coverage'];

// Files to skip
const SKIP_FILES = ['content-check.js', 'ARCHITECTURE_IMPROVEMENT_PLAN.md'];

// ============================================================================
// SCANNER
// ============================================================================

function shouldSkipPath(filePath) {
  const parts = filePath.split(path.sep);
  return parts.some(part => SKIP_DIRECTORIES.includes(part));
}

function shouldSkipFile(fileName) {
  return SKIP_FILES.includes(fileName);
}

function isCodeAllowed(match, context) {
  return CODE_ALLOWED_PATTERNS.some(allowed => context.includes(allowed));
}

function scanFile(filePath) {
  const issues = [];
  const fileName = path.basename(filePath);

  if (shouldSkipFile(fileName)) {
    return issues;
  }

  const ext = path.extname(filePath);
  if (!SCAN_EXTENSIONS.includes(ext)) {
    return issues;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      FORBIDDEN_PATTERNS.forEach(({ pattern, description }) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // Check if this is an allowed code pattern
            if (!isCodeAllowed(match, line)) {
              issues.push({
                file: filePath,
                line: lineNumber,
                column: line.indexOf(match) + 1,
                match: match,
                description: description,
                context: line.trim().substring(0, 100),
              });
            }
          });
        }
      });
    });
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
  }

  return issues;
}

function scanDirectory(dir) {
  let allIssues = [];

  if (shouldSkipPath(dir)) {
    return allIssues;
  }

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!SKIP_DIRECTORIES.includes(entry.name)) {
          allIssues = allIssues.concat(scanDirectory(fullPath));
        }
      } else if (entry.isFile()) {
        allIssues = allIssues.concat(scanFile(fullPath));
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }

  return allIssues;
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  console.log('🔍 Content Check - Scanning for forbidden content...\n');

  const srcDir = path.join(__dirname, '..', 'src');
  const readmePath = path.join(__dirname, '..', 'README.md');

  let issues = [];

  // Scan src directory
  if (fs.existsSync(srcDir)) {
    issues = issues.concat(scanDirectory(srcDir));
  }

  // Scan README
  if (fs.existsSync(readmePath)) {
    issues = issues.concat(scanFile(readmePath));
  }

  // Report results
  if (issues.length > 0) {
    console.error('❌ FORBIDDEN CONTENT FOUND!\n');
    console.error('The following issues must be resolved before publishing:\n');

    // Group by file
    const byFile = {};
    issues.forEach(issue => {
      if (!byFile[issue.file]) {
        byFile[issue.file] = [];
      }
      byFile[issue.file].push(issue);
    });

    Object.entries(byFile).forEach(([file, fileIssues]) => {
      const relativePath = path.relative(path.join(__dirname, '..'), file);
      console.error(`📁 ${relativePath}`);
      fileIssues.forEach(issue => {
        console.error(`   Line ${issue.line}: "${issue.match}" - ${issue.description}`);
        console.error(`   Context: ${issue.context}`);
      });
      console.error('');
    });

    console.error(`\n📊 Total: ${issues.length} issue(s) found in ${Object.keys(byFile).length} file(s)`);
    console.error('\n⚠️  Publishing blocked until all issues are resolved.');
    console.error('    This content violates App Store Guideline 1.1 (Objectionable Content).\n');

    process.exit(1);
  }

  console.log('✅ Content check passed - No forbidden content found!\n');
  console.log('📦 Safe to publish.\n');
  process.exit(0);
}

main();
