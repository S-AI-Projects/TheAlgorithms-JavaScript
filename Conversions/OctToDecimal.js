/**
 * @function octalToDecimal
 * @description Converts a valid octal number represented as a non-negative decimal-encoded
 * integer (where each decimal digit is an octal digit in 0..7) to its decimal equivalent.
 * For example:
 * - Smallest valid input: octalToDecimal(0) = 0
 * - Representative ordinary input: octalToDecimal(56) = 5 * 8^1 + 6 * 8^0 = 40 + 6 = 46
 *
 * Invariants:
 * 1. Output type and shape: returns a non-negative finite JavaScript number.
 * 2. Identity / Round-trip: For any valid octal integer x, parseInt(String(x), 8) === octalToDecimal(x).
 * 3. Monotonicity: For valid octal integers a < b, octalToDecimal(a) < octalToDecimal(b).
 * 4. Fresh equivalent input & non-mutation: Given two fresh identical inputs a === b,
 *    octalToDecimal(a) === octalToDecimal(b) with no mutation of inputs or external state.
 *
 * @param {number} num - Octal number using digits 0-7 encoded as a standard JavaScript number.
 * @returns {number} The decimal representation of the octal number.
 */
function octalToDecimal(num) {
  let dec = 0
  let base = 1
  while (num > 0) {
    const r = num % 10
    num = Math.floor(num / 10)
    dec = dec + r * base
    base = base * 8
  }
  return dec
}

export { octalToDecimal }

// > octalToDecimal(56)
// 46

// > octalToDecimal(2365)
// 1269
