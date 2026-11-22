/**
 * Author: dephraiim
 * License: GPL-3.0 or later
 *
 * An Armstrong number is equal to the sum of its own digits each raised to the power of the number of digits.
 * For example, 370 is an Armstrong number because 3*3*3 + 7*7*7 + 0*0*0 = 370.
 * An Armstrong number is often called Narcissistic number.
 *
 * Preconditions and Protected Semantic Invariants:
 * - Line 24 (`num < 0`): Boundary check strictly protects non-negative integers including 0.
 *   The smallest valid input is 0 (0^1 = 0, returning true); mutating to `num <= 0` is an off-by-one
 *   error that incorrectly rejects 0.
 * - Line 27 (`** numStr.length`): Dynamic exponentiation strictly depends on the total number of digits.
 *   Mutating to a fixed power (e.g. `** 3`) incorrectly evaluates higher-order Armstrong numbers such
 *   as 1634 (1^4 + 6^4 + 3^4 + 4^4 = 1634).
 *
 * @param {number} num - Integer candidate to test.
 * @returns {boolean} True if num is an Armstrong number, false otherwise.
 *
 * @example
 * armstrongNumber(0) // returns true (smallest valid input, 0^1 = 0)
 * armstrongNumber(370) // returns true (3^3 + 7^3 + 0^3 = 370)
 * armstrongNumber(1634) // returns true (1^4 + 6^4 + 3^4 + 4^4 = 1634)
 * armstrongNumber(300) // returns false
 */

const armstrongNumber = (num) => {
  if (typeof num !== 'number' || num < 0) return false
  const numStr = num.toString()
  const sum = [...numStr].reduce(
    (acc, digit) => acc + parseInt(digit) ** numStr.length,
    0
  )
  return sum === num
}

export { armstrongNumber }
