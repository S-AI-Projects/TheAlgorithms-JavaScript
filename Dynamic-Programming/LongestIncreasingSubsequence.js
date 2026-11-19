/**
 * A Dynamic Programming based solution for calculating Longest Increasing Subsequence
 * https://en.wikipedia.org/wiki/Longest_increasing_subsequence
 */

/**
 * Returns the length of the longest strictly increasing subsequence.
 *
 * @param {number[]} x - Input array of numbers.
 * @returns {number} The subsequence length, or 0 for an empty array.
 * The input array is read without being modified.
 */
function longestIncreasingSubsequence(x) {
  const length = x.length
  if (length == 0) {
    return 0
  }
  const dp = Array(length).fill(1)

  let res = 1

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < i; j++) {
      if (x[i] > x[j]) {
        dp[i] = Math.max(dp[i], 1 + dp[j])
        if (dp[i] > res) {
          res = dp[i]
        }
      }
    }
  }

  return res
}

export { longestIncreasingSubsequence }
