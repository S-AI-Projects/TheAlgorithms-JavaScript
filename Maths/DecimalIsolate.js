/**
 * Isolates the decimal (fractional) part of a number.
 *
 * Supported domain:
 * Real numbers represented in standard fixed-point decimal format
 * (magnitudes between 1e-6 and 1e21).
 * The smallest supported positive input with a decimal fraction is 0.000001 (1e-6).
 * Numbers without a fractional part (e.g. integers) or unsupported representations return 0.
 *
 * @param {number} number - The input number.
 * @returns {number} The isolated decimal part, or 0 if none.
 */
export const decimalIsolate = (number) => {
  const str = number + ''
  if (!str.includes('.')) {
    return 0
  }
  const answer = parseFloat(str.replace(/^[-\d]+\./, '.'))
  return isNaN(answer) === true ? 0 : answer
}
