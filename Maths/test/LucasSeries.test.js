import { lucas } from '../LucasSeries'

describe('Nth Lucas Number', () => {
  describe('Existing tests', () => {
    it('should return the 20th Lucas Number', () => {
      expect(lucas(20)).toBe(15127)
    })

    it('should return the 0th Lucas Number', () => {
      expect(lucas(0)).toBe(2)
    })

    it('should return the 100th Lucas Number', () => {
      expect(lucas(100)).toBe(792070839848372100000)
    })
  })

  describe('Stated Fixture: Smallest valid input and ordinary input', () => {
    it('handles smallest valid index: 0 (Precondition line 21: index >= 0)', () => {
      const input = 0
      // Independently calculated: L_0 = 2
      const expected = 2
      const result = lucas(input)

      expect(result).toBe(expected)
    })

    it('handles ordinary input: 5 (Precondition line 21 & 24)', () => {
      const input = 5
      // Independently calculated: L_0=2, L_1=1, L_2=3, L_3=4, L_4=7, L_5=11
      const expected = 11
      const result = lucas(input)

      expect(result).toBe(expected)
    })

    it('handles ordinary input: 20', () => {
      const input = 20
      const expected = 15127
      const result = lucas(input)

      expect(result).toBe(expected)
    })
  })

  describe('Recurrence Sequence & Invariant Checks', () => {
    it('verifies the first 8 Lucas numbers explicitly: [2, 1, 3, 4, 7, 11, 18, 29]', () => {
      const expectedSeries = [2, 1, 3, 4, 7, 11, 18, 29]
      for (let n = 0; n < expectedSeries.length; n++) {
        expect(lucas(n)).toBe(expectedSeries[n])
      }
    })

    it('verifies the recurrence invariant L_n = L_{n-1} + L_{n-2} for n >= 2', () => {
      for (let n = 2; n <= 25; n++) {
        expect(lucas(n)).toBe(lucas(n - 1) + lucas(n - 2))
      }
    })
  })

  describe('Precondition enforcement: Negative and Decimal inputs', () => {
    it('throws TypeError("Index cannot be Negative") for negative numbers (Line 21)', () => {
      expect(() => lucas(-1)).toThrow(TypeError)
      expect(() => lucas(-1)).toThrow('Index cannot be Negative')
      expect(() => lucas(-10)).toThrow('Index cannot be Negative')
    })

    it('throws TypeError("Index cannot be a Decimal") for non-integer numbers (Line 24)', () => {
      expect(() => lucas(0.5)).toThrow(TypeError)
      expect(() => lucas(0.5)).toThrow('Index cannot be a Decimal')
      expect(() => lucas(3.14159)).toThrow('Index cannot be a Decimal')
    })
  })
})
