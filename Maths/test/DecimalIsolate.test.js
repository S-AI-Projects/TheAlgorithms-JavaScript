import { decimalIsolate } from '../DecimalIsolate'

describe('Maths/DecimalIsolate boundary and contract tests', () => {
  // Precondition: Maths/DecimalIsolate.js line 2: 'function isolates the decimal part of a number.'
  // Precondition: Maths/DecimalIsolate.js line 8: '(number + \'\').replace(/^[-\\d]+\\./, \'.\')' requires standard decimal representation.

  describe('Valid Interior', () => {
    // Ordinary positive floating-point number
    it('isolates the decimal part of an ordinary positive float (12.34)', () => {
      // Source line 2 establishes isolation of decimal part; line 8 isolates fractional digits after decimal dot.
      expect(decimalIsolate(12.34)).toBe(0.34)
    })

    // Ordinary negative floating-point number
    it('isolates the decimal part of an ordinary negative float (-1.2)', () => {
      // Source line 2 & line 8: leading '-' and digits are replaced, leaving the positive fractional part.
      expect(decimalIsolate(-1.2)).toBe(0.2)
    })

    it('isolates the decimal part of 0.5', () => {
      // Source line 2: Isolates decimal part of 0.5.
      expect(decimalIsolate(0.5)).toBe(0.5)
    })
  })

  describe('Valid Boundary', () => {
    // Smallest supported positive valid input in standard fixed-point notation (1e-6 = 0.000001)
    // Numbers < 1e-6 are rendered in exponential notation by JavaScript toString()
    it('isolates the decimal part of the smallest valid input in standard decimal domain (0.000001)', () => {
      // Source line 8: 0.000001 stringifies as '0.000001', smallest fixed-point magnitude without scientific notation.
      expect(decimalIsolate(0.000001)).toBe(0.000001)
    })

    it('isolates the decimal part of negative smallest valid input (-0.000001)', () => {
      // Source line 8: -0.000001 stringifies as '-0.000001'.
      expect(decimalIsolate(-0.000001)).toBe(0.000001)
    })

    it('isolates the decimal part of 1.000001', () => {
      // Source line 8: integer part 1 with smallest 6th-place fractional part.
      expect(decimalIsolate(1.000001)).toBe(0.000001)
    })

    // Boundary: integers with zero fractional part
    it('returns 0 for integer 0', () => {
      // Source line 2 & 9: integer 0 has no decimal fraction; returns 0.
      expect(decimalIsolate(0)).toBe(0)
    })

    it('returns 0 for single-digit integer 1', () => {
      // Source line 2 & 9: integer 1 has no decimal fraction; returns 0.
      expect(decimalIsolate(1)).toBe(0)
    })

    it('returns 0 for multi-digit integer 10', () => {
      // Source line 2 & 9: integer 10 has no decimal fraction; returns 0.
      expect(decimalIsolate(10)).toBe(0)
    })
  })

  describe('Explicitly Unsupported (Beyond Boundary)', () => {
    // Just beyond the smallest supported boundary: 1e-7 stringifies to "1e-7" (exponential notation)
    it('safely returns 0 for inputs outside standard decimal representation (1e-7)', () => {
      // Source line 8 & 9: 1e-7 has no '.' in standard stringification, falls back to 0 without throwing error.
      expect(decimalIsolate(1e-7)).toBe(0)
    })

    it('safely returns 0 for numbers >= 1e21 (exponential notation)', () => {
      // Source line 8 & 9: 1e21 stringifies to "1e+21", falls back to 0 without throwing error.
      expect(decimalIsolate(1e21)).toBe(0)
    })
  })
})
