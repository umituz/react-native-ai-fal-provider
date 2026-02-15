/**
 * Array Sorter Utilities
 * Sort operations for arrays of objects
 */

/**
 * Sort array by date property (descending - newest first)
 * Invalid dates are sorted to the end
 */
export function sortByDateDescending<T>(
  items: readonly T[],
  dateProperty: keyof T
): T[] {
  return [...items].sort((a, b) => {
    const timeA = new Date(a[dateProperty] as unknown as string).getTime();
    const timeB = new Date(b[dateProperty] as unknown as string).getTime();

    // Handle invalid dates - NaN should sort to end
    if (isNaN(timeA) && isNaN(timeB)) return 0;
    if (isNaN(timeA)) return 1; // a goes to end
    if (isNaN(timeB)) return -1; // b goes to end

    return timeB - timeA;
  });
}

/**
 * Sort array by date property (ascending - oldest first)
 * Invalid dates are sorted to the end
 */
export function sortByDateAscending<T>(
  items: readonly T[],
  dateProperty: keyof T
): T[] {
  return [...items].sort((a, b) => {
    const timeA = new Date(a[dateProperty] as unknown as string).getTime();
    const timeB = new Date(b[dateProperty] as unknown as string).getTime();

    // Handle invalid dates - NaN should sort to end
    if (isNaN(timeA) && isNaN(timeB)) return 0;
    if (isNaN(timeA)) return 1; // a goes to end
    if (isNaN(timeB)) return -1; // b goes to end

    return timeA - timeB;
  });
}

/**
 * Sort array by number property (descending)
 * NaN and Infinity values are sorted to the end
 */
export function sortByNumberDescending<T>(
  items: readonly T[],
  numberProperty: keyof T
): T[] {
  return [...items].sort((a, b) => {
    const numA = a[numberProperty] as unknown as number;
    const numB = b[numberProperty] as unknown as number;

    // Handle NaN and Infinity
    const isAValid = isFinite(numA);
    const isBValid = isFinite(numB);

    if (!isAValid && !isBValid) return 0;
    if (!isAValid) return 1; // a goes to end
    if (!isBValid) return -1; // b goes to end

    return numB - numA;
  });
}

/**
 * Sort array by number property (ascending)
 * NaN and Infinity values are sorted to the end
 */
export function sortByNumberAscending<T>(
  items: readonly T[],
  numberProperty: keyof T
): T[] {
  return [...items].sort((a, b) => {
    const numA = a[numberProperty] as unknown as number;
    const numB = b[numberProperty] as unknown as number;

    // Handle NaN and Infinity
    const isAValid = isFinite(numA);
    const isBValid = isFinite(numB);

    if (!isAValid && !isBValid) return 0;
    if (!isAValid) return 1; // a goes to end
    if (!isBValid) return -1; // b goes to end

    return numA - numB;
  });
}
