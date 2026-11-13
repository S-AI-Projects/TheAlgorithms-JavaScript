import { octalToDecimal } from '../OctToDecimal'

describe('Tests for octalToDecimal', () => {
  // Preconditions established in Conversions/OctToDecimal.js:
  // Line 20: function octalToDecimal(num) expects a valid non-negative octal integer (digits 0-7).
  // Line 23: while (num > 0) extracts base-10 digits via num % 10 (line 24) and shifts via Math.floor(num / 10) (line 25).
  // Line 26: accumulates decimal value as dec + r * base.
  // Line 27: updates base = base * 8.
  // Line 29: returns dec (a non-negative finite integer).

  test('The Decimal representation of Octal number 56 is 46', () => {
    // Precondition: Conversions/OctToDecimal.js line 23-29
    const res = octalToDecimal(56)
    expect(res).toBe(46)
  })

  test('The Decimal representation of Octal number 99 is 81', () => {
    // Precondition: Conversions/OctToDecimal.js line 23-29
    const res = octalToDecimal(99)
    expect(res).toBe(81)
  })

  test('The Decimal representation of Octal number 17 is 15', () => {
    // Precondition: Conversions/OctToDecimal.js line 23-29
    const res = octalToDecimal(17)
    expect(res).toBe(15)
  })

  test('The Decimal representation of Octal number 100 is 64', () => {
    // Precondition: Conversions/OctToDecimal.js line 23-29
    const res = octalToDecimal(100)
    expect(res).toBe(64)
  })

  test('The Decimal representation of Octal number 0 is 0', () => {
    // Precondition: Conversions/OctToDecimal.js line 23 (loop condition num > 0 false for 0, returns initial dec = 0 from line 21)
    const res = octalToDecimal(0)
    expect(res).toBe(0)
  })

  describe('Fixtures and Invariant Checks', () => {
    // Smallest valid input: 0
    test('handles smallest valid input (0) with explicit expected output 0', () => {
      // Precondition: Conversions/OctToDecimal.js line 21 (initializes dec = 0), line 23 (num > 0 is false)
      const input = 0
      const expected = 0 // independently calculated: 0 in octal is 0 in decimal
      const actual = octalToDecimal(input)
      expect(actual).toBe(expected)
      expect(typeof actual).toBe('number')
      expect(Number.isFinite(actual)).toBe(true)
    })

    // Ordinary input: 56
    test('handles ordinary input (56) with independently calculated expected output 46', () => {
      // Precondition: Conversions/OctToDecimal.js line 24-27 (5 * 8^1 + 6 * 8^0 = 40 + 6 = 46)
      const input = 56
      const expected = 46 // independently calculated: 5 * 8 + 6 = 46
      const actual = octalToDecimal(input)
      expect(actual).toBe(expected)
      expect(typeof actual).toBe('number')
      expect(Number.isFinite(actual)).toBe(true)
    })

    test('preserves documented output type, shape, and non-mutation behavior on fresh equivalent inputs', () => {
      // Precondition: Conversions/OctToDecimal.js line 20-29
      const freshInput1 = 2365
      const freshInput2 = 2365
      const expected = 1269 // independently calculated: 2*8^3 + 3*8^2 + 6*8^1 + 5*8^0 = 1024 + 192 + 48 + 5 = 1269

      const actual1 = octalToDecimal(freshInput1)
      const actual2 = octalToDecimal(freshInput2)

      // Compare fresh equivalent inputs under controlled external state
      expect(actual1).toBe(expected)
      expect(actual2).toBe(expected)
      expect(actual1).toBe(actual2)

      // Shape and type: number, non-negative, finite, integer
      expect(typeof actual1).toBe('number')
      expect(Number.isInteger(actual1)).toBe(true)
      expect(actual1).toBeGreaterThanOrEqual(0)

      // Verify input values are not mutated (primitive numbers are immutable in JS, but verify identity remains identical)
      expect(freshInput1).toBe(2365)
      expect(freshInput2).toBe(2365)
    })

    // Seeded generator for at least 100 bounded valid octal inputs
    // Linear Congruential Generator (LCG) with deterministic seed
    function createLCG(seed = 123456789) {
      let state = seed >>> 0
      return function next() {
        // Numerical Recipes parameters: a = 1664525, c = 1013904223, m = 2^32
        state = (Math.imul(1664525, state) + 1013904223) >>> 0
        return state / 0x100000000
      }
    }

    // Generates a valid octal number in the domain [0, 7777777] (digits 0-7 only)
    function generateValidOctal(rng, maxDigits = 6) {
      const numDigits = 1 + Math.floor(rng() * maxDigits)
      let octalString = ''
      for (let i = 0; i < numDigits; i++) {
        const digit = Math.floor(rng() * 8)
        // Avoid leading zero unless single digit
        if (i === 0 && digit === 0 && numDigits > 1) {
          octalString += String(1 + Math.floor(rng() * 7))
        } else {
          octalString += String(digit)
        }
      }
      return parseInt(octalString, 10)
    }

    test('satisfies property invariants over 100+ bounded valid cases with fixed seed', () => {
      // Precondition: Conversions/OctToDecimal.js lines 20-29
      const rng = createLCG(42) // Fixed seed
      const generatedCases = []
      const count = 120 // >= 100 bounded valid cases

      for (let i = 0; i < count; i++) {
        const octalNum = generateValidOctal(rng, 6)
        generatedCases.push(octalNum)
      }

      // Ensure readable small case is present
      generatedCases.unshift(0, 1, 7, 10, 56, 77)

      let previousVal = -1
      // Sort cases to also verify ordering/monotonicity invariant
      const sortedUniqueCases = Array.from(new Set(generatedCases)).sort(
        (a, b) => a - b
      )

      for (const octalNum of sortedUniqueCases) {
        // Precondition: Conversions/OctToDecimal.js lines 23-29
        const actual = octalToDecimal(octalNum)

        // 1. Independent expected calculation using standard radix-8 parsing
        const expected = parseInt(String(octalNum), 8)
        expect(actual).toBe(expected)

        // 2. Output type and shape invariant
        expect(typeof actual).toBe('number')
        expect(Number.isInteger(actual)).toBe(true)
        expect(actual).toBeGreaterThanOrEqual(0)

        // 3. Monotonic ordering invariant: if a < b then octalToDecimal(a) < octalToDecimal(b)
        expect(actual).toBeGreaterThan(previousVal)
        previousVal = actual

        // 4. Fresh equivalent input comparison
        const freshCopy = Number(octalNum)
        expect(octalToDecimal(freshCopy)).toBe(actual)
      }
    })
  })
})
