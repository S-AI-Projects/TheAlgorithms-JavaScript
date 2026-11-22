import { palindromeRearranging } from '../CheckRearrangePalindrome'

describe('palindromeRearranging', () => {
  describe('Existing tests', () => {
    test('palindromeRearranging(apple) -> false', () => {
      const word = 'apple'
      const res = palindromeRearranging(word)
      expect(res).toBeFalsy()
    })

    test('palindromeRearranging(aapplle) -> true', () => {
      const word = 'aapplle'
      const res = palindromeRearranging(word)
      expect(res).toBeTruthy()
    })

    test('palindromeRearranging(value) -> false', () => {
      const word = 'value'
      const res = palindromeRearranging(word)
      expect(res).toBeFalsy()
    })

    test('palindromeRearranging(aaeccrr) -> true', () => {
      const word = 'aaeccrr'
      const res = palindromeRearranging(word)
      expect(res).toBeTruthy()
    })
  })

  describe('Stated Fixture: ["", "a", "aba", "ab", "abba"]', () => {
    it('handles empty string "" returning "Empty string" sentinel (Precondition line 23: !str)', () => {
      const input = ''
      const expected = 'Empty string'
      const result = palindromeRearranging(input)
      expect(result).toBe(expected)
    })

    it('handles single character "a" returning true', () => {
      const input = 'a'
      const expected = true
      const result = palindromeRearranging(input)
      expect(result).toBe(expected)
    })

    it('handles odd palindrome "aba" returning true', () => {
      const input = 'aba'
      const expected = true
      const result = palindromeRearranging(input)
      expect(result).toBe(expected)
    })

    it('handles non-rearrangeable "ab" returning false', () => {
      const input = 'ab'
      const expected = false
      const result = palindromeRearranging(input)
      expect(result).toBe(expected)
    })

    it('handles even palindrome "abba" returning true', () => {
      const input = 'abba'
      const expected = true
      const result = palindromeRearranging(input)
      expect(result).toBe(expected)
    })
  })

  describe('Normalization Specification: No case-folding or trimming performed', () => {
    it('treats uppercase and lowercase characters distinctly (e.g., "Aa" has 2 odd counts -> false)', () => {
      expect(palindromeRearranging('Aa')).toBe(false)
      expect(palindromeRearranging('AAaa')).toBe(true)
    })

    it('treats whitespace characters as distinct characters', () => {
      expect(palindromeRearranging('a a')).toBe(true)
      expect(palindromeRearranging('a b')).toBe(false)
      expect(palindromeRearranging('a b ')).toBe(false)
    })
  })

  describe('Deterministic Execution, Repeatability & Input Isolation', () => {
    it('runs the same fixture twice in fresh isolated state and once after another valid input, asserting identical results', () => {
      const fixtureInputs = ['', 'a', 'aba', 'ab', 'abba']
      const expectedOutputs = ['Empty string', true, true, false, true]

      // Run 1: initial run
      const run1 = fixtureInputs.map((s) => palindromeRearranging(s))
      expect(run1).toEqual(expectedOutputs)

      // Run 2: immediate repeated run
      const run2 = fixtureInputs.map((s) => palindromeRearranging(s))
      expect(run2).toEqual(run1)

      // Interleaved run with different valid inputs
      palindromeRearranging('racecar')
      palindromeRearranging('random_unrelated_string')
      palindromeRearranging('xyzzyx')

      // Run 3: run after interleaved execution
      const run3 = fixtureInputs.map((s) => palindromeRearranging(s))
      expect(run3).toEqual(run1)
    })

    it('returns "Not a string" sentinel on non-string inputs (Precondition line 19: typeof str !== "string")', () => {
      expect(palindromeRearranging(0)).toBe('Not a string')
      expect(palindromeRearranging(121)).toBe('Not a string')
      expect(palindromeRearranging(null)).toBe('Not a string')
      expect(palindromeRearranging(undefined)).toBe('Not a string')
      expect(palindromeRearranging({})).toBe('Not a string')
      expect(palindromeRearranging([])).toBe('Not a string')
    })
  })
})
