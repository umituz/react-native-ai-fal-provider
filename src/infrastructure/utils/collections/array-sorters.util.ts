/**
 * Array Sorter Utilities
 * Sort operations for arrays of objects
 */

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
