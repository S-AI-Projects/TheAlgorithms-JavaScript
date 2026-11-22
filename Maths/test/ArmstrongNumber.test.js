import { armstrongNumber } from '../ArmstrongNumber'

describe('ArmstrongNumber', () => {
  it('should return true for an armstrong number', () => {
    expect(armstrongNumber(371)).toBeTruthy()
  })

  it('should return false for a non-armstrong number', () => {
    expect(armstrongNumber(300)).toBeFalsy()
  })

  it('should return false for negative values', () => {
    expect(armstrongNumber(-2)).toBeFalsy()
  })

  describe('Mutation-Resistant Regression Suite (Protected Conditions)', () => {
    it('protects boundary condition against off-by-one mutation on smallest valid input 0 (Line 24: num < 0)', () => {
      // Smallest valid input: 0 (0^1 = 0)
      // Plausible mistake: mutating Line 24 to `num <= 0` incorrectly rejects 0
      expect(armstrongNumber(0)).toBe(true)
    })

    it('protects single-digit Armstrong numbers (0 through 9)', () => {
      // Every single-digit non-negative number d has d^1 = d
      expect(armstrongNumber(1)).toBe(true)
      expect(armstrongNumber(5)).toBe(true)
      expect(armstrongNumber(9)).toBe(true)
    })

    it('protects ordinary 3-digit Armstrong numbers (370, 371, 153, 407)', () => {
      // 370: 3^3 + 7^3 + 0^3 = 27 + 343 + 0 = 370
      expect(armstrongNumber(370)).toBe(true)
      // 153: 1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153
      expect(armstrongNumber(153)).toBe(true)
      // 407: 4^3 + 0^3 + 7^3 = 64 + 0 + 343 = 407
      expect(armstrongNumber(407)).toBe(true)
    })

    it('protects dynamic exponentiation against hardcoded cube mutation (Line 27: ** numStr.length)', () => {
      // 4-digit Armstrong number: 1634 = 1^4 + 6^4 + 3^4 + 4^4 = 1 + 1296 + 81 + 256 = 1634
      // Plausible mistake: hardcoding `** 3` passes 371, 370, 153 but fails 1634 (evaluates to 308)
      expect(armstrongNumber(1634)).toBe(true)
      // 8208 = 8^4 + 2^4 + 0^4 + 8^4 = 4096 + 16 + 0 + 4096 = 8208
      expect(armstrongNumber(8208)).toBe(true)
    })

    it('correctly rejects ordinary non-Armstrong numbers of varying lengths', () => {
      expect(armstrongNumber(10)).toBe(false)
      expect(armstrongNumber(100)).toBe(false)
      expect(armstrongNumber(1633)).toBe(false)
    })

    it('correctly rejects non-number types and negative numbers', () => {
      expect(armstrongNumber('370')).toBe(false)
      expect(armstrongNumber(null)).toBe(false)
      expect(armstrongNumber(undefined)).toBe(false)
      expect(armstrongNumber(-153)).toBe(false)
    })
  })
})
