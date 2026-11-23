import { countLetters } from '../CountLetters'

describe('CountLetters', () => {
  it('expect throws on use wrong param', () => {
    expect(() => countLetters(0)).toThrow()
  })

  it('expect throws when using a number in the string', () => {
    expect(() => countLetters('h3llo')).toThrow()
  })

  it('expect throws when using a special characters in the string', () => {
    expect(() => countLetters('hello!')).toThrow()
  })

  it('count the letters in a string. Allows lower case', () => {
    const value = 'hello'
    const count = countLetters(value)
    expect(count).toEqual({ h: 1, e: 1, l: 2, o: 1 })
  })

  it('count the letters in a string. Allows upper case', () => {
    const value = 'HELLO'
    const count = countLetters(value)
    expect(count).toEqual({ h: 1, e: 1, l: 2, o: 1 })
  })

  it('count the letters in a string. Allows upper and lower case', () => {
    const value = 'HelLo'
    const count = countLetters(value)
    expect(count).toEqual({ h: 1, e: 1, l: 2, o: 1 })
  })
})

// Regression tests written before refactoring countLetters
// (CountLetters.js line 9). Expected objects were counted by hand.
describe('countLetters contract (locked before refactor)', () => {
  // Preconditions: input is a string (line 12), has no \W characters
  // (line 16) and no digits (line 20). '' passes all three.
  it('smallest valid input: empty string gives an empty object', () => {
    expect(countLetters('')).toEqual({})
  })

  it('ordinary input: counts are case-insensitive, keys in first-seen order', () => {
    const count = countLetters('Mississippi')
    expect(count).toEqual({ m: 1, i: 4, s: 4, p: 2 })
    expect(Object.keys(count)).toEqual(['m', 'i', 's', 'p'])
  })

  it('underscore is a word character, so it is counted', () => {
    expect(countLetters('a_b')).toEqual({ a: 1, _: 1, b: 1 })
  })

  it('throws the documented TypeError messages', () => {
    expect(() => countLetters(0)).toThrow(
      new TypeError('Input should be a string')
    )
    expect(() => countLetters('two words')).toThrow(
      new TypeError('Input must not contain special characters')
    )
    expect(() => countLetters('h3llo')).toThrow(
      new TypeError('Input must not contain numbers')
    )
  })

  it('returns a new object on each call', () => {
    const first = countLetters('ab')
    const second = countLetters('ab')
    expect(first).toEqual({ a: 1, b: 1 })
    expect(second).not.toBe(first)
  })
})
