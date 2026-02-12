/**
 * Array Reducer Utilities
 * Reduce, group, chunk, and aggregation operations
 */

/**
 * Reduce array to sum of number property
 */
export function sumByProperty<T>(
  items: readonly T[],
  numberProperty: keyof T
): number {
  return items.reduce((sum, item) => {
    const value = item[numberProperty] as unknown as number;
    return sum + (typeof value === "number" ? value : 0);
  }, 0);
}

/**
 * Group array by property value
 */
export function groupByProperty<T>(
  items: readonly T[],
  property: keyof T
): Map<unknown, T[]> {
  const groups = new Map<unknown, T[]>();
  for (const item of items) {
    const key = item[property];
    const existing = groups.get(key);
    if (existing) {
      existing.push(item);
    } else {
      groups.set(key, [item]);
    }
  }
  return groups;
}

/**
 * Chunk array into smaller arrays of specified size
 */
export function chunkArray<T>(items: readonly T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    result.push([...items.slice(i, i + chunkSize)]);
  }
  return result;
}

/**
 * Get distinct values of a property from array
 */
export function distinctByProperty<T>(
  items: readonly T[],
  property: keyof T
): unknown[] {
  const seen = new Set<unknown>();
  const result: unknown[] = [];
  for (const item of items) {
    const value = item[property];
    if (!seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  }
  return result;
}
