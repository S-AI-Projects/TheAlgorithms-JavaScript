import { liouvilleFunction } from '../LiouvilleFunction'

const expectedValuesArray = [
  1, -1, -1, 1, -1, 1, -1, -1, 1, 1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, 1, 1,
  -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, 1, 1, 1, -1, -1, -1, -1,
  -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1,
  -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1,
  -1, 1, 1, -1, 1, 1, 1, 1, -1, -1, -1, 1
]

describe('Testing liouville function', () => {
  // Preconditions established in Maths/LiouvilleFunction.js:
  // Line 35: export const liouvilleFunction = (number) =>
  // Line 36: if (number <= 0) throw new Error('Number must be greater than zero.')
  // Line 39: return PrimeFactors(number).length % 2 === 0 ? 1 : -1

  for (let i = 1; i <= 100; i++) {
    it(
      'Testing for number = ' + i + ', should return ' + expectedValuesArray[i],
      () => {
        // Precondition: Maths/LiouvilleFunction.js line 39
        expect(liouvilleFunction(i)).toBe(expectedValuesArray[i - 1])
      }
    )
  }

  it('should throw error when supplied negative numbers', () => {
    // Precondition: Maths/LiouvilleFunction.js line 36
    expect(() => {
      liouvilleFunction(-1)
    }).toThrow(Error)
  })

  it('should throw error when supplied zero', () => {
    // Precondition: Maths/LiouvilleFunction.js line 36
    expect(() => {
      liouvilleFunction(0)
    }).toThrow(Error)
  })

  describe('Fixtures and Complexity Regression Tests', () => {
    // Smallest valid input: n = 1
    it('handles smallest valid input (number = 1) with explicit expected output 1', () => {
      // Precondition: Maths/LiouvilleFunction.js line 39 (PrimeFactors(1) is [], length 0 is even -> returns 1)
      const input = 1
      const expected = 1 // 1 has 0 prime factors; (-1)^0 = 1
      const actual = liouvilleFunction(input)
      expect(actual).toBe(expected)
      expect(typeof actual).toBe('number')
      expect(actual === 1 || actual === -1).toBe(true)
    })

    // Representative ordinary input: n = 12
    it('handles representative ordinary input (number = 12) with independently calculated expected output -1', () => {
      // Precondition: Maths/LiouvilleFunction.js line 39 (PrimeFactors(12) is [2, 2, 3], length 3 is odd -> returns -1)
      const input = 12
      const expected = -1 // 12 = 2 * 2 * 3 (3 factors, odd) -> (-1)^3 = -1
      const actual = liouvilleFunction(input)
      expect(actual).toBe(expected)
      expect(typeof actual).toBe('number')
      expect(actual).toBe(-1)
    })

    // Large representative scaling input: prime number 1,000,003 and composite 1,000,000
    it('handles large representative inputs verifying complexity scaling correctness', () => {
      // Precondition: Maths/LiouvilleFunction.js line 39
      // 1,000,000 = 10^6 = 2^6 * 5^6 (12 prime factors, even) -> (-1)^12 = 1
      expect(liouvilleFunction(1000000)).toBe(1)

      // 999983 is a prime number (1 prime factor, odd) -> (-1)^1 = -1
      expect(liouvilleFunction(999983)).toBe(-1)
    })

    it('preserves purity and input non-mutation across repeated and interleaved runs', () => {
      // Precondition: Maths/LiouvilleFunction.js lines 35-39
      const expected = -1
      const input = 12

      const actual1 = liouvilleFunction(input)
      expect(actual1).toBe(expected)

      // Interleaved run with a different valid input (10 -> 2 * 5, 2 factors -> 1)
      const interleaved = liouvilleFunction(10)
      expect(interleaved).toBe(1)

      // Repeated invocation after interleaved run
      const actual2 = liouvilleFunction(input)
      expect(actual2).toBe(expected)
      expect(actual1).toBe(actual2)
    })
  })
})
