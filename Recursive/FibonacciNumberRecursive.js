/**
 * @function Fibonacci
 * @description Function to return the N-th Fibonacci number.
 * @param {Integer} n - The input integer
 * @return {Integer} - Return the N-th Fibonacci number
 * @see [Fibonacci](https://en.wikipedia.org/wiki/Fibonacci_number)
 *
 * Indexing is zero-based: fibonacci(0) = 0, fibonacci(1) = 1, fibonacci(10) = 55.
 *
 * Complexity, with input size n = the index passed in (not its bit length):
 * - Calls: exactly C(n) = 2 * F(n + 1) - 1, because C(0) = C(1) = 1 and
 *   C(n) = 1 + C(n - 1) + C(n - 2). So time is Theta(phi^n), phi ~ 1.618;
 *   each step of 4 in n multiplies the work by about phi^4 ~ 6.85.
 *   The function is deterministic, so this is both the worst and every case.
 * - Space: O(n) for the recursion stack (deepest chain n, n-1, ..., 1).
 * An experiment counting calls for n = 20, 24, 28 matched C(n) exactly.
 */

const fibonacci = (n) => {
  if (n < 2) {
    return n
  }
  return fibonacci(n - 2) + fibonacci(n - 1)
}

export { fibonacci }
