import { describe, it, expect } from 'vitest'
import { PermutationinString } from '../PermutationinString.js'

describe('PermutationinString', () => {
  it('handles smallest valid inputs (precondition lines 10, 11, 16, 25, 44)', () => {
    // Smallest valid empty strings (lines 10-11, line 16: 0 <= 0, line 25 -> true)
    expect(PermutationinString('', '')).toBe(true)

    // Smallest valid 1-character lowercase strings (line 44 alphabet domain)
    expect(PermutationinString('a', 'a')).toBe(true)
    expect(PermutationinString('a', 'b')).toBe(false)
  })

  it('handles ordinary inputs and preserves boolean return type (lines 12, 52, 57)', () => {
    const resTrue = PermutationinString('ab', 'eidbaooo')
    const resFalse = PermutationinString('ab', 'eidboaoo')

    expect(typeof resTrue).toBe('boolean')
    expect(typeof resFalse).toBe('boolean')
    expect(resTrue).toBe(true)
    expect(resFalse).toBe(false)
    expect(PermutationinString('abc', 'bcab')).toBe(true)
    expect(PermutationinString('abc', '')).toBe(false)
  })

  it('detects permutation at the final suffix window of s2 (regression for line 26 boundary: end < s2.length - 1)', () => {
    // Minimal distinguishing input: 'a' appears only at the final index of 'ba'
    expect(PermutationinString('a', 'ba')).toBe(true)
    expect(PermutationinString('ab', 'cba')).toBe(true)
  })

  it('maintains state isolation across repeated calls with fresh equivalent inputs', () => {
    const s1First = String('ab')
    const s2First = String('cba')
    const s1Second = String('ab')
    const s2Second = String('cba')

    const first = PermutationinString(s1First, s2First)
    // Intervening call with distinct inputs
    expect(PermutationinString('xyz', 'abcdef')).toBe(false)
    const second = PermutationinString(s1Second, s2Second)

    expect(first).toBe(true)
    expect(second).toBe(true)
    expect(first).toStrictEqual(second)
  })
})
