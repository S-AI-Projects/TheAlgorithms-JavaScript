/**
 * Converts ounces to kilograms.
 * https://en.wikipedia.org/wiki/Ounce
 *
 * Contract:
 * - Total function: returns a number for any input.
 * - Valid numeric inputs (oz >= 0) return the equivalent mass in kilograms.
 * - Missing, non-numeric, or absent-result inputs (undefined, NaN) evaluate to NaN
 *   without throwing exceptions or mutating caller-owned state.
 *
 * @function ouncesToKilograms
 * @param {number} oz - Amount of ounces to convert to kilograms.
 * @returns {number} Equivalent weight in kilograms, or NaN for non-numeric/missing inputs.
 */
const ouncesToKilograms = (oz) => {
  return (oz * 28.3498) / 1000
}

export default ouncesToKilograms
