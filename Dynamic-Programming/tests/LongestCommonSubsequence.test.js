import { longestCommonSubsequence } from '../LongestCommonSubsequence'

describe('longestCommonSubsequence pure function contract & state isolation (Precondition near line 30 of Dynamic-Programming/LongestCommonSubsequence.js)', () => {
  // Observable Dependencies: None. longestCommonSubsequence is a pure deterministic function.

  test('Smallest valid input ("", "")', () => {
    expect(longestCommonSubsequence('', '')).toBe(0)
  })

  test('Ordinary input ("ABCDGH", "AEDFHR")', () => {
    expect(longestCommonSubsequence('ABCDGH', 'AEDFHR')).toBe(3)
  })

  test('State isolation: repeated calls return identical results without state leakage', () => {
    const str1 = 'AGGTAB'
    const str2 = 'GXTXAYB'

    // Run 1 in fresh state
    const firstRun = longestCommonSubsequence(str1, str2)
    expect(firstRun).toBe(4)

    // Intervening call with different valid input
    const interveningRun = longestCommonSubsequence('ABCD', 'ACDF')
    expect(interveningRun).toBe(3)

    // Run 2 after intervening call
    const secondRun = longestCommonSubsequence(str1, str2)
    expect(secondRun).toBe(4)
  })

  test('Preserves input isolation and immutability', () => {
    const str1 = 'BAT'
    const str2 = 'CAT'
    const orig1 = str1
    const orig2 = str2

    longestCommonSubsequence(str1, str2)

    expect(str1).toBe(orig1)
    expect(str2).toBe(orig2)
  })
})
