/**
 * Computes all-pairs shortest paths using the Floyd-Warshall algorithm.
 *
 * Source:
 *   https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
 * Complexity:
 *   O(|V|^3) where V is the set of vertices.
 *
 * Preconditions and Failure / Empty-Result Behavior:
 * - Precondition at Line 24 (`const n = dist.length`): For an empty graph (`dist = []`),
 *   `n` is 0. The outer relaxation loop condition `k < n` (Line 25) evaluates to false,
 *   bypassing all relaxation loops and directly executing Line 35 (`return dist`),
 *   returning the valid empty result `[]` without error.
 * - Absent-path sentinel (`Infinity`): Where no path exists between vertices `i` and `j`,
 *   the condition `dist[i][j] > dist[i][k] + dist[k][j]` at Line 28 is never satisfied
 *   for any intermediate vertex `k`. Thus, `dist[i][j]` preserves the `Infinity` sentinel,
 *   representing unreachable vertices / absent shortest paths.
 * - In-place mutation: The function updates and returns the input `dist` matrix. Caller-owned
 *   matrices can be shallow/deep copied prior to invocation if caller persistence is required.
 *
 * @param {number[][]} dist - 2D square matrix where dist[i][j] represents edge weight b/w i and j.
 * @returns {number[][]} Updated 2D matrix where dist[i][j] represents shortest distance b/w i and j.
 *
 * @example
 * // Empty graph (empty-result path, Line 35)
 * FloydWarshall([]) // returns []
 *
 * @example
 * // Smallest valid input (1x1 matrix, Line 24)
 * FloydWarshall([[0]]) // returns [[0]]
 *
 * @example
 * // Ordinary graph with shortest paths computed
 * FloydWarshall([
 *   [0, 1, 2, Infinity],
 *   [1, 0, Infinity, Infinity],
 *   [2, Infinity, 0, 1],
 *   [Infinity, Infinity, 1, 0]
 * ])
 * // returns:
 * // [
 * //   [0, 1, 2, 3],
 * //   [1, 0, 3, 4],
 * //   [2, 3, 0, 1],
 * //   [3, 4, 1, 0]
 * // ]
 */
const FloydWarshall = (dist) => {
  // Input:- dist: 2D Array where dist[i][j] = edge weight b/w i and j
  // Output:- dist: 2D Array where dist[i][j] = shortest dist b/w i and j
  const n = dist.length
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          // dist from i to j via k is lesser than the current distance
          dist[i][j] = dist[i][k] + dist[k][j]
        }
      }
    }
  }
  return dist
}

export { FloydWarshall }
