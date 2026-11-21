import { generateCombinations } from '../AllCombinationsOfSizeK'

describe('AllCombinationsOfSizeK', () => {
  // Preconditions established in Backtracking/AllCombinationsOfSizeK.js:
  // Line 31: function generateCombinations(n, k) receives pool size n and combination size k.
  // Line 37: if (currentCombination.length === k) saves copy to allCombinations and returns.
  // Line 42: if (currentValue > n) prunes search branch and returns.
  // Lines 46-50: explores include-branch, pops, and explores exclude-branch.

  it('should return 3x2 matrix solution for n = 3 and k = 2', () => {
    // Precondition: Backtracking/AllCombinationsOfSizeK.js lines 37-50
    const res = generateCombinations(3, 2)
    expect(res).toEqual([
      [1, 2],
      [1, 3],
      [2, 3]
    ])
  })

  it('should return 6x2 matrix solution for n = 4 and k = 2', () => {
    // Precondition: Backtracking/AllCombinationsOfSizeK.js lines 37-50
    const res = generateCombinations(4, 2)
    expect(res).toEqual([
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
      [3, 4]
    ])
  })

  describe('Fixtures and Executable Documentation Examples', () => {
    // Smallest valid input: n = 0, k = 0
    it('handles smallest valid input (n = 0, k = 0) with explicit expected output [[]]', () => {
      // Precondition: Backtracking/AllCombinationsOfSizeK.js line 37
      // Decisive state transition: initial currentCombination.length === 0 matches k === 0 immediately
      const input = [0, 0]
      const expected = [[]] // 0 choose 0 is 1 combination: empty set
      const actual = generateCombinations(...input)
      expect(actual).toEqual(expected)
      expect(Array.isArray(actual)).toBe(true)
      expect(actual.length).toBe(1)
    })

    // Smallest single-element fixture: n = 1, k = 1
    it('handles boundary unit input (n = 1, k = 1) with explicit expected output [[1]]', () => {
      // Precondition: Backtracking/AllCombinationsOfSizeK.js lines 37, 46
      const input = [1, 1]
      const expected = [[1]]
      const actual = generateCombinations(...input)
      expect(actual).toEqual(expected)
    })

    // Representative ordinary input: n = 3, k = 2 (matches concrete documentation example)
    it('executes documented worked example for representative ordinary input (n = 3, k = 2)', () => {
      // Precondition: Backtracking/AllCombinationsOfSizeK.js lines 37-50
      // Decisive state transitions occur at length === 2 when snapshots [1, 2], [1, 3], and [2, 3] are captured
      const n = 3
      const k = 2
      const expected = [
        [1, 2],
        [1, 3],
        [2, 3]
      ]
      const actual = generateCombinations(n, k)
      expect(actual).toEqual(expected)

      // Verify intermediate output shape invariants
      expect(actual.length).toBe(3) // 3 choose 2 = 3
      actual.forEach((comb) => {
        expect(comb.length).toBe(k)
        expect(comb[0]).toBeLessThan(comb[1]) // strictly ascending
      })
    })

    it('preserves purity and input non-mutation across repeated and interleaved runs', () => {
      // Precondition: Backtracking/AllCombinationsOfSizeK.js lines 31-56
      const expected = [
        [1, 2],
        [1, 3],
        [2, 3]
      ]

      // Run 1: First invocation
      const actual1 = generateCombinations(3, 2)
      expect(actual1).toEqual(expected)

      // Interleaved run on different input (4, 3) -> 4 choose 3 = 4
      const interleaved = generateCombinations(4, 3)
      expect(interleaved).toEqual([
        [1, 2, 3],
        [1, 2, 4],
        [1, 3, 4],
        [2, 3, 4]
      ])

      // Run 2: Repeated invocation after interleaved execution
      const actual2 = generateCombinations(3, 2)
      expect(actual2).toEqual(expected)
      expect(actual1).toEqual(actual2)
    })
  })
})
