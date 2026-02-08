/**
 * Collection Filter Utilities
 * Common filter operations for arrays of objects
 */

/**
 * Filter array by property value
 */
export function filterByProperty<T>(
  items: readonly T[],
  property: keyof T,
  value: unknown
): T[] {
  return items.filter((item) => item[property] === value);
}

/**
 * Filter array by predicate function
 */
export function filterByPredicate<T>(
  items: readonly T[],
  predicate: (item: T) => boolean
): T[] {
  return items.filter(predicate);
}

/**
 * Filter array by time range (timestamp property)
 */
export function filterByTimeRange<T>(
  items: readonly T[],
  timestampProperty: keyof T,
  startTime: number,
  endTime: number
): T[] {
  return items.filter((item) => {
    const timestamp = item[timestampProperty] as unknown as number;
    return timestamp >= startTime && timestamp <= endTime;
  });
}

/**
 * Filter array by multiple property values (OR logic)
 */
export function filterByAnyProperty<T>(
  items: readonly T[],
  property: keyof T,
  values: readonly unknown[]
): T[] {
  const valueSet = new Set(values);
  return items.filter((item) => valueSet.has(item[property]));
}

/**
 * Sort array by date property (descending - newest first)
 */
export function sortByDateDescending<T>(
  items: readonly T[],
  dateProperty: keyof T
): T[] {
  return [...items].sort((a, b) => {
    const timeA = new Date(a[dateProperty] as unknown as string).getTime();
    const timeB = new Date(b[dateProperty] as unknown as string).getTime();
    return timeB - timeA;
  });
}

/**
 * Sort array by date property (ascending - oldest first)
 */
export function sortByDateAscending<T>(
  items: readonly T[],
  dateProperty: keyof T
): T[] {
  return [...items].sort((a, b) => {
    const timeA = new Date(a[dateProperty] as unknown as string).getTime();
    const timeB = new Date(b[dateProperty] as unknown as string).getTime();
    return timeA - timeB;
  });
}

/**
 * Sort array by number property (descending)
 */
export function sortByNumberDescending<T>(
  items: readonly T[],
  numberProperty: keyof T
): T[] {
  return [...items].sort((a, b) => {
    const numA = a[numberProperty] as unknown as number;
    const numB = b[numberProperty] as unknown as number;
    return numB - numA;
  });
}

/**
 * Sort array by number property (ascending)
 */
export function sortByNumberAscending<T>(
  items: readonly T[],
  numberProperty: keyof T
): T[] {
  return [...items].sort((a, b) => {
    const numA = a[numberProperty] as unknown as number;
    const numB = b[numberProperty] as unknown as number;
    return numA - numB;
  });
}

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
    result.push(items.slice(i, i + chunkSize) as T[]);
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
