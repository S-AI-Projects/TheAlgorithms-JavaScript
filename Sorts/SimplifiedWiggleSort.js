/*
 * Wiggle sort sorts the array into a wave like array.
 * An array ‘arr[0..n-1]’ is sorted in wave form if arr[0] <= arr[1] >= arr[2] <= arr[3] >= arr[4] <= …..
 * KEEP IN MIND: there are also more strict definitions of wiggle sort which use
 * the rule arr[0] < arr[1] > arr[2] < arr[3] > arr[4] < … but this function
 * allows for equality of values next to each other.
 * Sorts `arr` in place and returns a separate array in weak wiggle order.
 */
export const simplifiedWiggleSort = function (arr) {
  // Interleave the lower and upper sorted halves to satisfy the weak wiggle order.
  const sorted = arr.sort((a, b) => a - b)
  const result = new Array(arr.length)
  const middle = Math.ceil(arr.length / 2)

  for (let i = 0; i < arr.length; i++) {
    if (i % 2 === 0) {
      result[i] = sorted[i / 2]
    } else {
      result[i] = sorted[middle + Math.floor(i / 2)]
    }
  }

  return result
}
