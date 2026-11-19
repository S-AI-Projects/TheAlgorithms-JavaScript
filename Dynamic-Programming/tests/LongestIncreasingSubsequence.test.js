import { longestIncreasingSubsequence } from '../LongestIncreasingSubsequence'

describe('Testing longestIncreasingSubsequence', () => {
  it.each([
    [[], 0],
    [[1], 1],
    [[2, 2], 1],
    [[3, 3, 3], 1],
    [[4, 4, 4, 4], 1],
    [[1, 2], 2],
    [[1, 2, 2, 2, 2], 2],
    [[1, 0, 2], 2],
    [[1, 10, 2, 30], 3],
    [[5, 8, 3, 7, 9, 1], 3],
    [[10, 9, 2, 5, 3, 7, 101, 18], 4],
    [[10, 10, 9, 9, 2, 2, 5, 5, 3, 3, 7, 7, 101, 101, 18, 18], 4],
    [[0, 1, 0, 3, 2, 3], 4],
    [[1, 1, 2, 2, 2], 2],
    [[1, 1, 2, 2, 2, 3, 3, 3, 3], 3],
    [[0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15], 6]
  ])('check with %j', (input, expected) => {
    expect(longestIncreasingSubsequence(input)).toBe(expected)
  })
})

describe('longestIncreasingSubsequence contract', () => {
  // Source precondition: LongestIncreasingSubsequence.js returns 0 when x.length is 0.
  it.each([
    [[], 0],
    [[3, 1, 2, 5, 4], 3],
    [[2, 2, 2], 1]
  ])('returns the expected length for %j', (input, expected) => {
    expect(longestIncreasingSubsequence(input)).toBe(expected)
  })

  it('does not mutate the caller input', () => {
    const input = [3, 1, 2, 5, 4]
    const before = [...input]
    expect(longestIncreasingSubsequence(input)).toBe(3)
    expect(input).toEqual(before)
  })
})
