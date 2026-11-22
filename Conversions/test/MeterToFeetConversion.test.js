import { meterToFeet, feetToMeter } from '../MeterToFeetConversion'

// Deterministic Linear Congruential Generator (LCG) for reproducible property tests
function createLCG(seed = 123456789) {
  let s = seed
  return function () {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

describe('Testing conversion of Meter to Feet', () => {
  it('with feet value', () => {
    expect(meterToFeet(30.48)).toBe(100)
  })
})

describe('Testing conversion of Feet to Meter', () => {
  it('with feet value', () => {
    expect(feetToMeter(10)).toBe(3.048)
  })

  describe('Stated Fixture: Smallest valid input and ordinary input', () => {
    it('handles smallest valid length: 0 feet (Precondition line 18: feet >= 0)', () => {
      const input = 0
      // Independently calculated: 0 * 0.3048 = 0
      const expected = 0
      const result = feetToMeter(input)

      expect(result).toBe(expected)
    })

    it('handles one ordinary input: 10 feet (Precondition line 18: feet >= 0)', () => {
      const input = 10
      // Independently calculated: 10 * 0.3048 = 3.048
      const expected = 3.048
      const result = feetToMeter(input)

      expect(result).toBe(expected)
    })
  })

  describe('Property & Invariant Checks: 100 bounded valid cases with fixed seed', () => {
    const rng = createLCG(123456789)
    const cases = []
    for (let i = 0; i < 100; i++) {
      cases.push(Number((rng() * 1000 + 0.01).toFixed(4)))
    }

    it('verifies exact scaling ratio invariant (feetToMeter(x) / x === 0.3048) for 100 cases', () => {
      for (const x of cases) {
        const m = feetToMeter(x)
        const ratio = m / x
        expect(Math.abs(ratio - 0.3048)).toBeLessThan(1e-12)
      }
    })

    it('verifies round-trip invertibility invariant (meterToFeet(feetToMeter(x)) === x) for 100 cases', () => {
      for (const x of cases) {
        const m = feetToMeter(x)
        const back = meterToFeet(m)
        expect(Math.abs(back - x)).toBeLessThan(1e-9)
      }
    })

    it('verifies linearity and additivity invariant: feetToMeter(a + b) === feetToMeter(a) + feetToMeter(b)', () => {
      for (let i = 0; i < cases.length - 1; i += 2) {
        const a = cases[i]
        const b = cases[i + 1]
        const combined = feetToMeter(a + b)
        const separate = feetToMeter(a) + feetToMeter(b)
        expect(Math.abs(combined - separate)).toBeLessThan(1e-9)
      }
    })

    it('verifies strict monotonicity: x1 < x2 implies feetToMeter(x1) < feetToMeter(x2)', () => {
      const sortedCases = [...cases].sort((a, b) => a - b)
      for (let i = 0; i < sortedCases.length - 1; i++) {
        if (sortedCases[i] < sortedCases[i + 1]) {
          expect(feetToMeter(sortedCases[i])).toBeLessThan(
            feetToMeter(sortedCases[i + 1])
          )
        }
      }
    })
  })

  describe('Smallest failing case detection under broken invariant mutant', () => {
    it('demonstrates that an incorrect scale factor fails the ratio invariant on x = 1', () => {
      const brokenFeetToMeter = (f) => f * 0.3
      const input = 1
      const expected = 0.3048
      const actual = brokenFeetToMeter(input)

      expect(Math.abs(actual - expected)).toBeGreaterThan(0.001)
    })
  })
})
