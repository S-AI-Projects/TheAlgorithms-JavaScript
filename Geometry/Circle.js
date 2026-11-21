/**
 * This class represents a circle and can calculate its perimeter and area.
 * https://en.wikipedia.org/wiki/Circle
 *
 * Invariants:
 * 1. Output type: perimeter() and area() return non-negative finite numbers.
 * 2. Deterministic & Pure: No external observable dependencies (no time, randomness, network, or UI).
 * 3. Input isolation: Executing operations on one instance or running interleaved inputs
 *    does not mutate other instances or subsequent calculation results.
 *
 * @constructor
 * @param {number} radius - The radius of the circle (non-negative number).
 */
export default class Circle {
  constructor(radius) {
    this.radius = radius
  }

  perimeter = () => {
    return this.radius * 2 * Math.PI
  }

  area = () => {
    return Math.pow(this.radius, 2) * Math.PI
  }
}
