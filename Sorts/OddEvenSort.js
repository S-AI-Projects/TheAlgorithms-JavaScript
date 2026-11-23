/*
  odd–even sort or odd–even transposition sort
  is a relatively simple sorting algorithm, developed originally for use on parallel processors with local interconnections.
  It is a comparison sort related to bubble sort, with which it shares many characteristics.

   for more information : https://en.wikipedia.org/wiki/Odd%E2%80%93even_sort
*/

/**
 * Helper function to swap array items in place.
 *
 * Invariant: a swap only exchanges two positions, so the multiset of values
 * in `arr` (every value and how many times it occurs) never changes.
 * This is what lets oddEvenSort return a permutation of its input.
 *
 * @param {Array} arr array to modify in place
 * @param {number} i first index
 * @param {number} j second index
 * @returns {undefined} nothing; `arr` is mutated
 * @example const a = [3, 1, 2]; swap(a, 0, 1) // a is now [1, 3, 2]
 */
export function swap(arr, i, j) {
  const tmp = arr[i]
  arr[i] = arr[j]
  arr[j] = tmp
}

/**
 * Sorts `arr` in ascending order, in place, and returns the same array.
 *
 * Invariants checked by the tests:
 * - the result is ordered: result[k] <= result[k + 1] for every k;
 * - the result has the same multiset of values as the input (only `swap`
 *   moves values);
 * - the returned array is the input array (`oddEvenSort(a) === a`).
 *
 * @param {number[]} arr array of mutually comparable numbers
 * @returns {number[]} the same array, now sorted ascending
 * @example oddEvenSort([3, 1, 2]) // [1, 2, 3]
 */
export function oddEvenSort(arr) {
  let sorted = false
  while (!sorted) {
    sorted = true
    for (let i = 1; i < arr.length - 1; i += 2) {
      if (arr[i] > arr[i + 1]) {
        swap(arr, i, i + 1)
        sorted = false
      }
    }
    for (let i = 0; i < arr.length - 1; i += 2) {
      if (arr[i] > arr[i + 1]) {
        swap(arr, i, i + 1)
        sorted = false
      }
    }
  }
  return arr
}
