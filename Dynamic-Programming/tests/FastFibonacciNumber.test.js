import { fastFibonacci, fib } from '../FastFibonacciNumber'

describe('Testing FibonacciNumber', () => {
  const errorCases = ['0', '12', true]

  test.each(errorCases)('throws an error if %p is invalid', (input) => {
    expect(() => {
      fastFibonacci(input)
    }).toThrow()
  })

  const testCases = [
    [0, 0],
    [1, 1],
    [10, 55],
    [25, 75025],
    [40, 102334155]
  ]

  test.each(testCases)('if input is %i it returns %i', (input, expected) => {
    expect(fastFibonacci(input)).toBe(expected)
  })
})

// --- Regression tests for fib ---
describe('fib helper function regression tests', () => {
  const fixture = [
    [0, [0, 1]],
    [1, [1, 1]],
    [2, [1, 2]],
    [5, [5, 8]],
    [10, [55, 89]]
  ]

  test.each(fixture)('fib(%i) should return %j', (input, expected) => {
    const result = fib(input)
    expect(result).toEqual(expected)
  })

  test('fib returns a fresh array and does not mutate shared state', () => {
    const firstCall = fib(5)
    firstCall[0] = 999

    const secondCall = fib(5)
    expect(secondCall).toEqual([5, 8])
    expect(firstCall).not.toBe(secondCall)
  })
})
