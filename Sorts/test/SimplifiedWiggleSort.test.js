import { simplifiedWiggleSort } from '../SimplifiedWiggleSort.js'

describe('simplified wiggle sort', () => {
  test('simplified wiggle sort for chars', () => {
    const src = ['a', 'b', 'c']
    expect(simplifiedWiggleSort(src)).toEqual(['a', 'c', 'b'])
  })

  test('wiggle sort with duplicates, even array', () => {
    const src = [2, 2, 1, 3]
    expect(simplifiedWiggleSort(src)).toEqual([1, 2, 2, 3])
  })

  test('wiggle sort with duplicates, odd array', () => {
    const src = [1, 1, 1, 2, 4]
    expect(simplifiedWiggleSort(src)).toEqual([1, 2, 1, 4, 1])
  })

  test('simplified wiggle sort with equal adjacent values', () => {
    const src = [3, 3, 5, 1]
    expect(simplifiedWiggleSort(src)).toEqual([1, 3, 3, 5])
  })
})

const isWiggle = (values) =>
  values.every((value, index) => {
    if (index === 0) return true
    return index % 2 === 1
      ? values[index - 1] <= value
      : values[index - 1] >= value
  })

const sortedCopy = (values) => [...values].sort((a, b) => a - b)

describe('simplifiedWiggleSort invariant', () => {
  it.each([[[3, 1, 2]], [[2, 2, 1]], [[1, 2, 3]], [[3, 2, 1]], [[7]]])(
    'preserves the multiset and wiggle order for %j',
    (input) => {
      const original = [...input]
      const output = simplifiedWiggleSort(input)
      expect(isWiggle(output)).toBe(true)
      expect(sortedCopy(output)).toEqual(sortedCopy(original))
    }
  )

  it('mutates the input to sorted order and returns a separate wiggle array', () => {
    const input = [3, 1, 2]
    const original = [...input]
    const output = simplifiedWiggleSort(input)
    expect(output).not.toBe(input)
    expect(input).toEqual(sortedCopy(original))
    expect(output).toEqual([1, 3, 2])
  })

  it('handles a duplicate-heavy input', () => {
    const input = [-1, 3, -1, -4, -5, 0, 4, 2, 4, 5]
    const original = [...input]
    const output = simplifiedWiggleSort(input)
    expect(isWiggle(output)).toBe(true)
    expect(sortedCopy(output)).toEqual(sortedCopy(original))
    expect(input).toEqual(sortedCopy(original))
  })

  it('holds for 100 deterministic bounded arrays', () => {
    let seed = 20261118
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }

    for (let caseIndex = 0; caseIndex < 100; caseIndex++) {
      const length = 1 + Math.floor(random() * 20)
      const input = Array.from({ length }, () => Math.floor(random() * 11) - 5)
      const original = [...input]
      const output = simplifiedWiggleSort(input)
      expect(isWiggle(output)).toBe(true)
      expect(sortedCopy(output)).toEqual(sortedCopy(original))
      expect(input).toEqual(sortedCopy(original))
    }
  })
})
