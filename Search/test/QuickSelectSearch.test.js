import { quickSelectSearch } from '../QuickSelectSearch'

describe('quickSelectSearch', () => {
  describe('Stated Fixture: Smallest valid input and ordinary input', () => {
    it('handles the smallest valid input: 1-element array with k = 0 (Precondition line 15: array.length > k)', () => {
      // Smallest valid input: single element array [42], target index k = 0
      const input = [42]
      const k = 0
      // Independently calculated expected output: [42] where result[0] === 42
      const expected = [42]
      const result = quickSelectSearch(input, k)

      expect(result).toBe(input)
      expect(result[0]).toBe(expected[0])
      expect(result).toEqual(expected)
    })

    it('handles one ordinary input: unsorted array with median target index k = 4 (Precondition line 15: array.length > k)', () => {
      // Ordinary input: 9 unsorted distinct elements
      const input = [9, 2, 7, 4, 5, 6, 3, 8, 1]
      const k = 4
      // Independently calculated expected output:
      // Sorted elements would be [1, 2, 3, 4, 5, 6, 7, 8, 9]
      // Element at sorted index k=4 is 5
      // Partition guarantee: all elements at indices < 4 are <= 5, all elements at indices > 4 are >= 5
      const result = quickSelectSearch(input, k)

      expect(result).toBe(input)
      expect(result[4]).toBe(5)
      // Check left partition (< index 4)
      for (let i = 0; i < 4; i++) {
        expect(result[i]).toBeLessThanOrEqual(5)
      }
      // Check right partition (> index 4)
      for (let i = 5; i < result.length; i++) {
        expect(result[i]).toBeGreaterThanOrEqual(5)
      }
    })
  })

  describe('Supported Boundary Cases (Valid side of contract)', () => {
    it('asserts lower supported boundary: k = 0 on multi-element array (Precondition line 15: array.length > k)', () => {
      const input = [5, 1, 9, 3, 7]
      const k = 0
      // Independently calculated expected: smallest element (1) at index 0
      const result = quickSelectSearch(input, k)

      expect(result[0]).toBe(1)
      for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThanOrEqual(1)
      }
    })

    it('asserts upper supported boundary: k = array.length - 1 (Precondition line 15: array.length > k)', () => {
      const input = [5, 1, 9, 3, 7]
      const k = 4 // array.length - 1
      // Independently calculated expected: largest element (9) at index 4
      const result = quickSelectSearch(input, k)

      expect(result[4]).toBe(9)
      for (let i = 0; i < 4; i++) {
        expect(result[i]).toBeLessThanOrEqual(9)
      }
    })

    it('asserts two-element array boundaries: k = 0 and k = 1', () => {
      const arr1 = [20, 10]
      const res1 = quickSelectSearch(arr1, 0)
      expect(res1[0]).toBe(10)
      expect(res1[1]).toBe(20)

      const arr2 = [20, 10]
      const res2 = quickSelectSearch(arr2, 1)
      expect(res2[0]).toBe(10)
      expect(res2[1]).toBe(20)
    })

    it('asserts domain boundary with duplicate elements', () => {
      const input = [3, 1, 3, 2, 3]
      const k = 2
      // Sorted: [1, 2, 3, 3, 3] -> element at index 2 is 3
      const result = quickSelectSearch(input, k)

      expect(result[2]).toBe(3)
      for (let i = 0; i < 2; i++) {
        expect(result[i]).toBeLessThanOrEqual(3)
      }
      for (let i = 3; i < result.length; i++) {
        expect(result[i]).toBeGreaterThanOrEqual(3)
      }
    })
  })

  describe('Explicitly Unsupported Boundaries (Invalid side of contract, Line 15-16)', () => {
    it('throws Error("Invalid arguments") when k equals array.length (just beyond upper boundary, Line 15)', () => {
      const input = [10, 20, 30]
      expect(() => quickSelectSearch(input, 3)).toThrow('Invalid arguments')
    })

    it('throws Error("Invalid arguments") when k exceeds array.length (Line 15)', () => {
      const input = [10, 20, 30]
      expect(() => quickSelectSearch(input, 5)).toThrow('Invalid arguments')
    })

    it('throws Error("Invalid arguments") when array is empty (array.length <= k, Line 15)', () => {
      expect(() => quickSelectSearch([], 0)).toThrow('Invalid arguments')
    })

    it('throws Error("Invalid arguments") when array is null or undefined (!array, Line 15)', () => {
      expect(() => quickSelectSearch(null, 0)).toThrow('Invalid arguments')
      expect(() => quickSelectSearch(undefined, 0)).toThrow('Invalid arguments')
    })
  })
})
