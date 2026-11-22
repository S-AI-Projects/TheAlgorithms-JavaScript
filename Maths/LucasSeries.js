/**
 * Calculates the Nth Lucas Number.
 * The Lucas sequence is defined as L_0 = 2, L_1 = 1, and L_n = L_{n-1} + L_{n-2} for n >= 2.
 *
 * Preconditions:
 * - Line 21: `if (index < 0)` throws TypeError('Index cannot be Negative')
 * - Line 24: `if (Math.floor(index) !== index)` throws TypeError('Index cannot be a Decimal')
 *
 * Refactoring Note:
 * Clarified state management in the iterative recurrence calculation by replacing
 * ambiguous variables `a`, `b`, and `temp` with semantically descriptive variables
 * `current` (representing L_i) and `next` (representing L_{i+1}).
 *
 * @param {number} index The 0-based position of the number in the Lucas sequence.
 * @returns {number} The Nth Lucas Number.
 * @throws {TypeError} If index is negative or decimal.
 * @see https://en.wikipedia.org/wiki/Lucas_number
 */
function lucas(index) {
  // index can't be negative
  if (index < 0) throw new TypeError('Index cannot be Negative')

  // index can't be a decimal
  if (Math.floor(index) !== index)
    throw new TypeError('Index cannot be a Decimal')

  let current = 2
  let next = 1
  for (let i = 0; i < index; i++) {
    const nextLucas = current + next
    current = next
    next = nextLucas
  }
  return current
}

export { lucas }
