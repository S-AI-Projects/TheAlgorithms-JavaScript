// Foot: https://en.wikipedia.org/wiki/Foot_(unit)

/**
 * Converts length from feet to meters.
 *
 * Invariant & Property Contract:
 * - Constant Scale / Ratio Invariant: For all non-negative real lengths `feet >= 0`,
 *   the conversion satisfies `feetToMeter(feet) === feet * 0.3048` where 0.3048 is the
 *   exact international yard and pound agreement constant (1 foot = 0.3048 meters).
 * - Linear Homogeneity: `feetToMeter(c * x) === c * feetToMeter(x)` and
 *   `feetToMeter(a + b) === feetToMeter(a) + feetToMeter(b)` within floating-point epsilon.
 * - Identity at Zero: `feetToMeter(0) === 0`.
 * - Round-trip Invertibility: `meterToFeet(feetToMeter(x)) === x` within precision epsilon.
 *
 * Precondition (Line 18):
 * - Input `feet` is expected to be a finite numeric value (feet >= 0 for physical length).
 *
 * @param {number} feet - Length in feet.
 * @returns {number} Length in meters.
 */
const feetToMeter = (feet) => {
  return feet * 0.3048
}

/**
 * Converts length from meters to feet.
 *
 * @param {number} meter - Length in meters.
 * @returns {number} Length in feet.
 */
const meterToFeet = (meter) => {
  return meter / 0.3048
}

export { feetToMeter, meterToFeet }
