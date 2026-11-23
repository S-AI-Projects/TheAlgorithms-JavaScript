import { oddEvenSort, swap } from '../OddEvenSort'

test('The OddEvenSort of the array [5, 4, 3, 2, 1] is [1, 2, 3, 4, 5]', () => {
  const arr = [5, 4, 3, 2, 1]
  const res = oddEvenSort(arr)
  expect(res).toEqual([1, 2, 3, 4, 5])
})

test('The OddEvenSort of the array [] is []', () => {
  const arr = []
  const res = oddEvenSort(arr)
  expect(res).toEqual([])
})

test('The OddEvenSort of the array [10, 14, 12, 20] is [10, 12, 14, 20]', () => {
  const arr = [10, 14, 12, 20]
  const res = oddEvenSort(arr)
  expect(res).toEqual([10, 12, 14, 20])
})

test('The OddEvenSort of the array [166, 169, 144] is [144, 166, 169]', () => {
  const arr = [166, 169, 144]
  const res = oddEvenSort(arr)
  expect(res).toEqual([144, 166, 169])
})

// Invariant tests for swap (OddEvenSort.js line 22) and the sort built on it.
// Domain (JSDoc at lines 28-40, comparisons at lines 46 and 52): arrays of mutually
// comparable numbers. The generator only produces finite integers.

// Small deterministic PRNG (mulberry32) so every run sees the same cases.
const mulberry32 = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const SEED = 20261123
const generateCases = (count) => {
  const random = mulberry32(SEED)
  const cases = []
  for (let n = 0; n < count; n++) {
    const length = Math.floor(random() * 13) // 0..12 items
    const values = []
    for (let k = 0; k < length; k++) {
      values.push(Math.floor(random() * 11) - 5) // -5..5, repeats likely
    }
    cases.push(values)
  }
  return cases
}

const isOrdered = (arr) => arr.every((v, k) => k === 0 || arr[k - 1] <= v)
const counts = (arr) => {
  const map = new Map()
  for (const v of arr) map.set(v, (map.get(v) || 0) + 1)
  return [...map.entries()].sort((a, b) => a[0] - b[0])
}

describe('swap invariant', () => {
  test('swap exchanges two positions in place and returns undefined', () => {
    const arr = [3, 1, 2]
    expect(swap(arr, 0, 1)).toBeUndefined()
    expect(arr).toEqual([1, 3, 2])
  })

  test('swap preserves multiplicities', () => {
    const arr = [2, 2, 1]
    swap(arr, 1, 2)
    expect(arr).toEqual([2, 1, 2])
    expect(counts(arr)).toEqual([
      [1, 1],
      [2, 2]
    ])
  })
})

describe('oddEvenSort fixture (ascending, in place)', () => {
  test.each([
    [
      [3, 1, 2],
      [1, 2, 3]
    ],
    [
      [2, 2, 1],
      [1, 2, 2]
    ],
    [
      [1, 2, 3],
      [1, 2, 3]
    ],
    [
      [3, 2, 1],
      [1, 2, 3]
    ],
    [[], []],
    [[7], [7]]
  ])('oddEvenSort(%j) is %j and returns the same array', (input, expected) => {
    const arr = [...input]
    const result = oddEvenSort(arr)
    expect(result).toEqual(expected)
    expect(result).toBe(arr)
  })
})

describe('oddEvenSort properties over 100 seeded cases', () => {
  const cases = generateCases(100)

  // On failure, report the shortest failing input so it stays readable.
  const smallestFailing = (fails) =>
    cases.filter(fails).sort((a, b) => a.length - b.length)[0]

  test('the generator is deterministic for a fixed seed', () => {
    expect(cases.length).toBe(100)
    // Pinned literal values for seed 20261123 (first case and two readable
    // small cases, one with a repeated value).
    expect(cases[0]).toEqual([4, 0, -1, -2, 0, -1, -5, 1, -4, 0, -3])
    expect(cases[10]).toEqual([-2, 5, 5])
    expect(cases[33]).toEqual([3, 5, -2])
    // The smallest supported collection (empty) is generated 4 times.
    expect(cases.filter((c) => c.length === 0).length).toBe(4)
  })

  test('readable small generated cases sort as expected', () => {
    expect(oddEvenSort([...cases[10]])).toEqual([-2, 5, 5])
    expect(oddEvenSort([...cases[33]])).toEqual([-2, 3, 5])
  })

  test('output is ordered', () => {
    const failing = smallestFailing((c) => !isOrdered(oddEvenSort([...c])))
    expect(failing).toBeUndefined()
  })

  test('output preserves input multiplicities', () => {
    const failing = smallestFailing(
      (c) =>
        JSON.stringify(counts(oddEvenSort([...c]))) !==
        JSON.stringify(counts(c))
    )
    expect(failing).toBeUndefined()
  })

  test('output is the input array, mutated in place', () => {
    for (const c of cases) {
      const arr = [...c]
      expect(oddEvenSort(arr)).toBe(arr)
    }
  })
})
