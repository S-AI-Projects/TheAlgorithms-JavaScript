import { CoPrimeCheck } from '../CoPrimeCheck'

describe('CoPrimeCheck', () => {
  // Preconditions established in Maths/CoPrimeCheck.js:
  // Line 34: const CoPrimeCheck = (firstNumber, secondNumber) =>
  // Line 39: return GetEuclidGCD(firstNumber, secondNumber) === 1

  it.each([
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 7],
    [20, 21],
    [5, 7],
    [-5, -7],
    [1, 0],
    [-1, 0]
  ])('returns true for %j and %i', (inputA, inputB) => {
    // Precondition: Maths/CoPrimeCheck.js line 39
    expect(CoPrimeCheck(inputA, inputB)).toBe(true)
    expect(CoPrimeCheck(inputB, inputA)).toBe(true)
  })

  it.each([
    [5, 15],
    [13 * 17 * 19, 17 * 23 * 29],
    [2, 0],
    [0, 0]
  ])('returns false for %j and %i', (inputA, inputB) => {
    // Precondition: Maths/CoPrimeCheck.js line 39
    expect(CoPrimeCheck(inputA, inputB)).toBe(false)
    expect(CoPrimeCheck(inputB, inputA)).toBe(false)
  })

  it('should throw when any of the inputs is not a number', () => {
    // Precondition: Maths/CoPrimeCheck.js line 34 (via GetEuclidGCD CheckInput)
    expect(() => CoPrimeCheck('1', 2)).toThrowError()
    expect(() => CoPrimeCheck(1, '2')).toThrowError()
  })

  describe('Mutation-Resistant Fixtures & Domain Checks (1, 2, 9, 11, 12)', () => {
    // Smallest valid input fixture: (1, 1)
    it('handles smallest valid coprime input (1, 1) with explicit expected output true', () => {
      // Precondition: Maths/CoPrimeCheck.js line 39 (gcd(1, 1) === 1)
      const input = [1, 1]
      const expected = true
      const actual = CoPrimeCheck(...input)
      expect(actual).toBe(expected)
      expect(typeof actual).toBe('boolean')
    })

    // Domain fixtures around 1, 2, 9, 11 and 12:
    // Testing coprimality across primes (2, 11) and composite numbers (9 = 3^2, 12 = 2^2 * 3)
    it('verifies coprime and non-coprime relations across domain around 1, 2, 9, 11 and 12', () => {
      // Precondition: Maths/CoPrimeCheck.js line 39

      // 1. (2, 9): 2 is prime, 9 is composite (3^2). gcd(2, 9) = 1 -> true
      expect(CoPrimeCheck(2, 9)).toBe(true)
      expect(CoPrimeCheck(9, 2)).toBe(true)

      // 2. (9, 11): 9 is composite (3^2), 11 is prime. gcd(9, 11) = 1 -> true
      expect(CoPrimeCheck(9, 11)).toBe(true)
      expect(CoPrimeCheck(11, 9)).toBe(true)

      // 3. Composite 9 must be rejected when sharing divisor with 12: gcd(9, 12) = 3 !== 1 -> false
      expect(CoPrimeCheck(9, 12)).toBe(false)
      expect(CoPrimeCheck(12, 9)).toBe(false)

      // 4. Testing sieve domain through 12: primes are 2, 3, 5, 7, 11
      // Composite 9 has divisor 3 (within 2 through sqrt(9) = 3); non-coprime with 3 and 12
      expect(CoPrimeCheck(9, 3)).toBe(false)
      expect(CoPrimeCheck(9, 6)).toBe(false)
      expect(CoPrimeCheck(2, 12)).toBe(false)
    })

    it('detects plausible one-line mutations in comparison or return conditions', () => {
      // Precondition: Maths/CoPrimeCheck.js line 39
      // Plausible mutation: changing `GetEuclidGCD(...) === 1` to `GetEuclidGCD(...) <= 1` or off-by-one `<=`
      // For input (0, 0), gcd(0, 0) is 0.
      // Correct: gcd === 1 evaluates to false.
      // Plausible mutant (gcd <= 1 or gcd < 2): would erroneously return true for (0, 0)!
      expect(CoPrimeCheck(0, 0)).toBe(false)

      // For input (0, 1), gcd(0, 1) is 1 -> true.
      expect(CoPrimeCheck(0, 1)).toBe(true)
    })

    it('preserves purity, determinism, and input non-mutation across repeated and interleaved runs', () => {
      // Precondition: Maths/CoPrimeCheck.js lines 34-39
      const input = [9, 11]
      const expected = true

      const actual1 = CoPrimeCheck(input[0], input[1])
      expect(actual1).toBe(expected)

      // Interleaved run on different input (9, 12) -> false
      const interleaved = CoPrimeCheck(9, 12)
      expect(interleaved).toBe(false)

      // Repeated run on original input
      const actual2 = CoPrimeCheck(...input)
      expect(actual2).toBe(expected)
      expect(actual1).toBe(actual2)

      // Verify input array unchanged
      expect(input).toEqual([9, 11])
    })
  })
})
