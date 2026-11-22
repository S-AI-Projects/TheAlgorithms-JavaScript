/**
 * Quickselect algorithm to place the `k`-th smallest element in its final sorted index `k`,
 * partitioning elements in-place: all elements at indices < `k` are <= array[k], and
 * all elements at indices > `k` are >= array[k].
 *
 * Supported Boundary Contract:
 * - Precondition check established at Line 15: `if (!array || array.length <= k)`
 * - Supported domain:
 *   - `array`: Non-empty Array of comparable numbers (`array.length >= 1`).
 *   - `k`: 0-based integer index within `[0, array.length - 1]`.
 * - Smallest valid input boundary:
 *   - Single-element array (`array.length === 1`) with `k === 0`.
 * - Upper valid domain boundary:
 *   - Any non-empty array with `k === array.length - 1`.
 * - Unsupported domain (throws `new Error('Invalid arguments')` at Line 16):
 *   - Falsy arrays (`!array`): `null`, `undefined`.
 *   - Empty arrays (`array.length === 0 <= k`).
 *   - Out-of-bounds index (`k >= array.length`).
 *
 * @param {Array<number>} array - The input array to partition in-place.
 * @param {number} k - The 0-based target index to position (0 <= k < array.length).
 * @returns {Array<number>} The mutated array with the k-th element in its final sorted index.
 * @throws {Error} 'Invalid arguments' when array is falsy or array.length <= k (Line 15).
 *
 * Reference: http://en.wikipedia.org/wiki/Quickselect
 */
export function quickSelectSearch(array, k) {
  if (!array || array.length <= k) {
    throw new Error('Invalid arguments')
  }

  let from = 0
  let to = array.length - 1
  while (from < to) {
    let left = from
    let right = to
    const pivot = array[Math.ceil((left + right) * 0.5)]

    while (left < right) {
      if (array[left] >= pivot) {
        const tmp = array[left]
        array[left] = array[right]
        array[right] = tmp
        --right
      } else {
        ++left
      }
    }

    if (array[left] > pivot) {
      --left
    }

    if (k <= left) {
      to = left
    } else {
      from = left + 1
    }
  }
  return array
}
