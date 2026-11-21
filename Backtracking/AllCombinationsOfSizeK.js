/**
 * @function generateCombinations
 * @description Generates all combinations of size k from the set of integers 1 through n
 * using a recursive backtracking (include / exclude) approach.
 *
 * Concrete Worked Example:
 * For representative input n = 3, k = 2:
 *
 * Intermediate State Trace:
 * 1. Initial state: currentCombination = [], currentValue = 1
 * 2. Decision 1 (include 1): currentCombination = [1], currentValue = 2
 * 3. Decision 2 (include 2): currentCombination = [1, 2], currentValue = 3
 *    - Decisive State Transition (line 37): currentCombination.length === k (length 2 === 2).
 *    - Snapshot saved: [1, 2] is appended to allCombinations.
 * 4. Backtrack (exclude 2): currentCombination = [1], currentValue = 3
 * 5. Decision 3 (include 3): currentCombination = [1, 3], currentValue = 4
 *    - Decisive State Transition (line 37): currentCombination.length === k (length 2 === 2).
 *    - Snapshot saved: [1, 3] is appended to allCombinations.
 * 6. Backtrack (exclude 1): currentCombination = [], currentValue = 2
 * 7. Decision 4 (include 2): currentCombination = [2], currentValue = 3
 * 8. Decision 5 (include 3): currentCombination = [2, 3], currentValue = 4
 *    - Decisive State Transition (line 37): currentCombination.length === k (length 2 === 2).
 *    - Snapshot saved: [2, 3] is appended to allCombinations.
 *
 * Final Result: [[1, 2], [1, 3], [2, 3]]
 *
 * @param {number} n - The upper bound integer in the candidate pool {1, ..., n}.
 * @param {number} k - The size of each combination subset.
 * @returns {number[][]} An array containing all valid k-combinations in lexicographical order.
 */
function generateCombinations(n, k) {
  const currentCombination = []
  const allCombinations = [] // will be used for storing all combinations
  let currentValue = 1

  function findCombinations() {
    if (currentCombination.length === k) {
      // Add the array of size k to the allCombinations array
      allCombinations.push([...currentCombination])
      return
    }
    if (currentValue > n) {
      // Check for exceeding the range
      return
    }
    currentCombination.push(currentValue++)
    findCombinations()
    currentCombination.pop()
    findCombinations()
    currentValue--
  }

  findCombinations()

  return allCombinations
}

export { generateCombinations }
