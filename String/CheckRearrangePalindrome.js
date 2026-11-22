/**
 * What is a palindrome? https://en.wikipedia.org/wiki/Palindrome
 * Receives a string and returns whether it can be rearranged to become a palindrome or not.
 * The string can only be a palindrome if the count of ALL characters is even or if at most ONE character count is odd.
 *
 * Determinism & Purity Contract:
 * - Pure Function: `palindromeRearranging` has zero external dependencies (no time, randomness, network, or mutable globals).
 * - Input Isolation & Repeatability: Repeated invocations with identical inputs yield identical outputs without side effects.
 * - Normalization Policy: Character normalization (case-folding or whitespace trimming) is NOT performed by this function.
 *   Characters are counted by exact Unicode character / case sensitivity (e.g. 'A' !== 'a').
 *
 * Preconditions:
 * - Line 19: `if (typeof str !== 'string')` returns sentinel string `'Not a string'`.
 * - Line 23: `if (!str)` returns sentinel string `'Empty string'`.
 *
 * @param {string} str - Input string to evaluate.
 * @returns {boolean|string} True if characters can form a palindrome, false otherwise; or sentinel string on invalid/empty input.
 */

export const palindromeRearranging = (str) => {
  // check that input is a string
  if (typeof str !== 'string') {
    return 'Not a string'
  }
  // Check if is a empty string
  if (!str) {
    return 'Empty string'
  }

  // First obtain the character count for each character in the string and store it in an object.
  // Filter the object's values to only the odd character counts.
  const charCounts = [...str].reduce((counts, char) => {
    counts[char] = counts[char] ? counts[char] + 1 : 1
    return counts
  }, {})
  // If the length of the resulting array is 0 or 1, the string can be a palindrome.
  return (
    Object.values(charCounts).filter((count) => count % 2 !== 0).length <= 1
  )
}
