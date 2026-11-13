import { exponentialFunction } from '../ExponentialFunction'

describe('Tests for exponential function', () => {
  // Preconditions established in Maths/ExponentialFunction.js:
  // Line 18: throws TypeError when power or n is NaN or n < 0.
  // Line 21: returns 1 when n === 0.
  // Lines 24-27: accumulates output += power ** i / fac for i from 0 to n-1.

  it('should be a function', () => {
    expect(typeof exponentialFunction).toEqual('function')
  })

  it('should throw error for invalid input', () => {
    // Precondition: Maths/ExponentialFunction.js line 18
    expect(() => exponentialFunction(2, -34)).toThrow(TypeError)
    expect(() => exponentialFunction(NaN, 5)).toThrow(TypeError)
    expect(() => exponentialFunction(2, NaN)).toThrow(TypeError)
  })

  it('should return the exponential function of power of 5 and order of 20', () => {
    // Precondition: Maths/ExponentialFunction.js lines 24-27
    const ex = exponentialFunction(5, 20)
    expect(ex).toBe(148.4131078683383)
  })

  describe('Independent Reference Comparison (20+ small valid inputs)', () => {
    // Smallest valid input: power=0, n=0
    it('handles smallest valid input (0, 0)', () => {
      // Precondition: Maths/ExponentialFunction.js line 21 (n === 0 returns 1)
      expect(exponentialFunction(0, 0)).toBe(1)
    })

    // Ordinary input: power=2, n=2 (representative result: 1 + 2 = 3)
    it('calculates representative ordinary input (2, 2)', () => {
      // Precondition: Maths/ExponentialFunction.js lines 24-27 (2^0/0! + 2^1/1! = 3)
      expect(exponentialFunction(2, 2)).toBe(3)
    })

    // Enumerated test table of 22 small valid inputs compared against independent calculation
    const testCases = [
      { power: 0, n: 1, expected: 1 },
      { power: 0, n: 2, expected: 1 },
      { power: 0, n: 5, expected: 1 },
      { power: 1, n: 0, expected: 1 },
      { power: 1, n: 1, expected: 1 },
      { power: 1, n: 2, expected: 2 },
      { power: 1, n: 3, expected: 2.5 },
      { power: 1, n: 4, expected: 2.6666666666666665 },
      { power: 1, n: 5, expected: 2.7083333333333335 },
      { power: 2, n: 0, expected: 1 },
      { power: 2, n: 1, expected: 1 },
      { power: 2, n: 3, expected: 5 },
      { power: -1, n: 0, expected: 1 },
      { power: -1, n: 1, expected: 1 },
      { power: -1, n: 2, expected: 0 },
      { power: -1, n: 3, expected: 0.5 },
      { power: -1, n: 4, expected: 0.33333333333333337 },
      { power: 0.5, n: 0, expected: 1 },
      { power: 0.5, n: 1, expected: 1 },
      { power: 0.5, n: 2, expected: 1.5 },
      { power: 0.5, n: 3, expected: 1.625 },
      { power: 2, n: 20, expected: 7.3890560989301735 }
    ]

    testCases.forEach(({ power, n, expected }) => {
      it(`evaluates exponentialFunction(${power}, ${n}) === ${expected}`, () => {
        // Precondition: Maths/ExponentialFunction.js line 21 or lines 24-27
        expect(exponentialFunction(power, n)).toBeCloseTo(expected, 14)
      })
    })
  })
})
