import { parityOutlier } from '../ParityOutlier'

describe('Testing parityOutlier function', () => {
  it('should return the odd number in an array of even numbers', () => {
    expect(parityOutlier([1, 2, 16, -8848, 5126])).toBe(1)
  })

  it('should return the even number in an array of odd numbers', () => {
    expect(parityOutlier([177, 5, 76, 1919])).toBe(76)
  })

  it('should, if the given array has only an odd and an even number, return the odd outlier', () => {
    expect(parityOutlier([1, 2])).toBe(1)
    expect(parityOutlier([4, 3])).toBe(3)
  })

  it('should return null if the given array is empty, contains only one integer, contains non-interger elements or does not have a parity outlier', () => {
    expect(parityOutlier([])).toBe(null)
    expect(parityOutlier([2])).toBe(null)
    expect(parityOutlier([2, {}, 5, 'GitHub'])).toBe(null)
    expect(parityOutlier([1, 3, 5, 7, 9])).toBe(null)
    expect(parityOutlier([0, 2, 4, 6, 8])).toBe(null)
    expect(parityOutlier([1, 3, 5, 7, 2, 4, 6, 8])).toBe(null)
  })
})

describe('parityOutlier contract & invariant checks (Precondition near line 9 of Maths/ParityOutlier.js)', () => {
  test('Smallest valid input ([1, 2])', () => {
    const input = [1, 2]
    expect(parityOutlier(input)).toBe(1)
  })

  test('Ordinary input ([1, 2, 16, -8848, 5126])', () => {
    const input = [1, 2, 16, -8848, 5126]
    expect(parityOutlier(input)).toBe(1)
  })

  test('Preserves input array immutability', () => {
    const input = [1, 2, 16, -8848, 5126]
    const copy = [...input]
    parityOutlier(input)
    expect(input).toEqual(copy)
  })

  // Seeded LCG generator for 100 bounded valid property cases
  function createLCG(seed = 12345) {
    let state = seed
    return function () {
      state = (state * 1664525 + 1013904223) % 4294967296
      return state / 4294967296
    }
  }

  test('Property test: 100 generated bounded valid inputs satisfy parity outlier invariant', () => {
    const rand = createLCG(42)

    for (let i = 0; i < 100; i++) {
      const isOutlierOdd = rand() > 0.5
      const length = 3 + Math.floor(rand() * 20)
      const outlierIndex = Math.floor(rand() * length)

      const arr = []
      for (let j = 0; j < length; j++) {
        if (j === outlierIndex) {
          const val = Math.floor(rand() * 1000) * 2 + (isOutlierOdd ? 1 : 0)
          arr.push(val)
        } else {
          const val = Math.floor(rand() * 1000) * 2 + (isOutlierOdd ? 0 : 1)
          arr.push(val)
        }
      }

      const expectedOutlier = arr[outlierIndex]
      const actualOutlier = parityOutlier(arr)

      expect(actualOutlier).toBe(expectedOutlier)
      const actualParity = Math.abs(actualOutlier % 2)
      const expectedParity = isOutlierOdd ? 1 : 0
      expect(actualParity).toBe(expectedParity)
    }
  })
})
