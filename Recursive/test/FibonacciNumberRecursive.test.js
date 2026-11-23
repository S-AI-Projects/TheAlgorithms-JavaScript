import { fibonacci } from '../FibonacciNumberRecursive'

describe('FibonacciNumberRecursive', () => {
  it('should return 0', () => {
    expect(fibonacci(0)).toBe(0)
  })

  it('should return 1', () => {
    expect(fibonacci(1)).toBe(1)
  })

  it('should return 5', () => {
    expect(fibonacci(5)).toBe(5)
  })

  it('should return 9', () => {
    expect(fibonacci(9)).toBe(34)
  })
})

// Regression for the zero-based indexing stated in the JSDoc of fibonacci
// (FibonacciNumberRecursive.js line 8). Expected values from the definition
// F(0) = 0, F(1) = 1, F(n) = F(n - 1) + F(n - 2).
describe('FibonacciNumberRecursive indexing', () => {
  it.each([
    [0, 0],
    [1, 1],
    [2, 1],
    [5, 5],
    [10, 55]
  ])('fibonacci(%i) is %i', (n, expected) => {
    expect(fibonacci(n)).toBe(expected)
  })
})
