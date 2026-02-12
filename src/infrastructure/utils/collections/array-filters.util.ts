/**
 * Array Filter Utilities
 * Filter operations for arrays of objects
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
