import { modularBinaryExponentiation } from '../ModularBinaryExponentiationRecursive'

describe('modularBinaryExponentiation', () => {
  it('should return the binary exponentiation', () => {
    expect(modularBinaryExponentiation(2, 10, 17)).toBe(4)
  })
})

import { modularBinaryExponentiation } from '../ModularBinaryExponentiationRecursive'

describe('modularBinaryExponentiation behavior & simplified parity logic (Precondition near line 9 of Maths/ModularBinaryExponentiationRecursive.js)', () => {
  test('Smallest valid input (base = 2, exponent = 0, mod = 5)', () => {
    expect(modularBinaryExponentiation(2, 0, 5)).toBe(1)
  })

  test('Ordinary input (base = 2, exponent = 10, mod = 1000)', () => {
    // 2^10 = 1024, 1024 % 1000 = 24
    expect(modularBinaryExponentiation(2, 10, 1000)).toBe(24)
  })

  test('Boundary input (mod = 1)', () => {
    expect(modularBinaryExponentiation(5, 3, 1)).toBe(0)
  })

  test('Equivalence across odd and even exponent evaluations', () => {
    expect(modularBinaryExponentiation(3, 5, 7)).toBe(5) // 3^5 = 243 % 7 = 5
    expect(modularBinaryExponentiation(7, 2, 13)).toBe(10) // 7^2 = 49 % 13 = 10
    expect(modularBinaryExponentiation(10, 4, 100)).toBe(0) // 10^4 = 10000 % 100 = 0
  })
})
