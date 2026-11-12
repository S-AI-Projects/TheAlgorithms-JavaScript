/**
 * @function modularBinaryExponentiation
 * @description Calculate (base^exponent) % mod recursively using binary exponentiation.
 * @param {number} base
 * @param {number} exponent
 * @param {number} mod
 * @returns {number}
 */
const isOddExponent = (exponent) => exponent % 2 !== 0

const modularBinaryExponentiation = (base, exponent, mod) => {
  if (mod === 1) return 0
  if (exponent === 0) return 1

  if (isOddExponent(exponent)) {
    return (base * modularBinaryExponentiation(base, exponent - 1, mod)) % mod
  } else {
    const half = modularBinaryExponentiation(base, exponent / 2, mod)
    return (half * half) % mod
  }
}

export { modularBinaryExponentiation }
