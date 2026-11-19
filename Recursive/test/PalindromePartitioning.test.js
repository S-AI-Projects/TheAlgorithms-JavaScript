import partitionPalindrome from '../PalindromePartitioning'

describe('Palindrome Partitioning', () => {
  it('should return all possible palindrome partitioning of s', () => {
    expect(partitionPalindrome('aab')).toEqual([
      ['a', 'a', 'b'],
      ['aa', 'b']
    ])
    expect(partitionPalindrome('a')).toEqual([['a']])
    expect(partitionPalindrome('ab')).toEqual([['a', 'b']])
  })
})

it('single character returns one palindrome partition', () => {
  expect(partitionPalindrome('a')).toEqual([['a']])
})

it.each([
  ['', [[]]],
  ['a', [['a']]],
  ['ab', [['a', 'b']]],
  ['aba', [['a', 'b', 'a'], ['aba']]],
  ['abba', [['a', 'b', 'b', 'a'], ['a', 'bb', 'a'], ['abba']]]
])('returns the expected partitions for %j', (input, expected) => {
  expect(partitionPalindrome(input)).toEqual(expected)
})

it('ensures every returned component equals its reversal', () => {
  const partitions = partitionPalindrome('abba')
  for (const partition of partitions) {
    for (const part of partition) {
      expect(part).toBe(part.split('').reverse().join(''))
    }
  }
})
