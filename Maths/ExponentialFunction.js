/**
 * @function exponentialFunction
 * @description Calculates the n-th partial sum (or n+1 th order Taylor series approximation)
 * of the exponential function e^power using Taylor expansion up to degree n-1.
 * For example, for representative input power = 2 and n = 2:
 * terms are (2^0 / 0!) + (2^1 / 1!) = 1 + 2 = 3.
 *
 * @param {number} power - The exponent x in e^x.
 * @param {number} n - The order / number of terms to sum (n >= 0).
 * @returns {number} The calculated approximation of e^power.
 * @throws {TypeError} When power or n is NaN or n < 0.
 * @url https://en.wikipedia.org/wiki/Exponential_function
 */
function exponentialFunction(power, n) {
  let output = 0
  let fac = 1
  if (isNaN(power) || isNaN(n) || n < 0) {
    throw new TypeError('Invalid Input')
  }
  if (n === 0) {
    return 1
  }
  for (let i = 0; i < n; i++) {
    output += power ** i / fac
    fac *= i + 1
  }
  return output
}

export { exponentialFunction }
