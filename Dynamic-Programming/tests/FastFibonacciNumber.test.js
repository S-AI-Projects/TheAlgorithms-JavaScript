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

describe('fib regression contract', () => {
  test('fib returns correct [F(n), F(n+1)] tuple pairs', () => {
    expect(fib(0)).toEqual([0, 1])
    expect(fib(1)).toEqual([1, 1])
    expect(fib(2)).toEqual([1, 2])
    expect(fib(5)).toEqual([5, 8])
    expect(fib(10)).toEqual([55, 89])
  })
})
