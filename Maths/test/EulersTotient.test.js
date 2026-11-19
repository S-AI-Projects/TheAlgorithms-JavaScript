import { EulersTotient } from '../EulersTotient'

describe('EulersTotient', () => {
  it('should return 6 as 1, 2, 4, 5, 7, and 8 are coprime to 9', () => {
    expect(EulersTotient(9)).toBe(6)
  })

  it('should return 4 as 1, 3, 7, and 9 are coprime to 10', () => {
    expect(EulersTotient(10)).toBe(4)
  })
})

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))
const referenceTotient = (n) => {
  let count = 0
  for (let candidate = 1; candidate <= n; candidate++) {
    if (gcd(candidate, n) === 1) count++
  }
  return count
}

describe('EulersTotient independent reference comparison', () => {
  it('matches the coprime-count reference for every integer from 1 to 20', () => {
    for (let n = 1; n <= 20; n++) {
      expect(EulersTotient(n)).toBe(referenceTotient(n))
    }
  })

  it('covers the smallest positive input', () => {
    expect(EulersTotient(1)).toBe(1)
  })
})
