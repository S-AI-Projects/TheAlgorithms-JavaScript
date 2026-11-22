/**
 * Given a two dimensional matrix, find its row echelon form.
 *
 * For more info: https://en.wikipedia.org/wiki/Row_echelon_form
 *
 * @param {number[[]]} matrix - Two dimensional array of rational numbers.
 * @returns {number[[]]} - Two dimensional array of rational numbers (row echelon form).
 *
 * @example
 * const matrix = [
 *                          [2,3,4,5,7],
 *                          [9,8,4,0,9],
 *                          [5,7,4,3,9],
 *                          [3,4,0,2,1]
 *                ]
 *
 * const result = rowEchelon(matrix)
 *
 * // The function returns the corresponding row echelon form:
 * // result:
 * //             [
 * //                       [1,  1.5,  2,        2.5,      3.5],
 * //                       [0,  1,    2.54545,  4.09091,  4.09091],
 * //                       [0,  0,    1,        1.57692,  1.36539],
 * //                       [0,  0,    0,        1,        -0.25]
 * //             ]
 */

// Set a tolerance value for floating-point comparisons
const tolerance = 0.000001

/**
 * Validates whether the given input is a valid two-dimensional rectangular matrix.
 *
 * Trace & Decisive State Transition:
 * 1. Initial State: Validates outer structure. Input must be a non-empty array whose first row is an array.
 * 2. Dimension Target: Establishes expected column count `numCols = matrix[0].length`.
 * 3. Row Inspection & Decisive Transition: Iterates across row indices `i` (0 <= i < numRows).
 *    - Decisive failure: If any row `matrix[i]` is not an array or `matrix[i].length !== numCols`,
 *      the validation transitions immediately to `false` (early exit).
 *    - Decisive success: If every row matches `numCols`, the validation transitions to `true`.
 *
 * @param {any} matrix - Two-dimensional array candidate to validate.
 * @returns {boolean} True if matrix is a valid rectangular 2D array; false otherwise.
 *
 * @example
 * // Example 1: Small rectangular matrix (2 rows x 3 columns)
 * // Input: [[1, 2, 3], [4, 5, 6]]
 * // numCols = 3; row 0 length = 3; row 1 length = 3.
 * // Output: true
 * isMatrixValid([[1, 2, 3], [4, 5, 6]]) // => true
 *
 * @example
 * // Example 2: 1x1 matrix (1 row x 1 column)
 * // Input: [[42]]
 * // numCols = 1; row 0 length = 1.
 * // Output: true
 * isMatrixValid([[42]]) // => true
 *
 * @example
 * // Example 3: Zero-containing matrix (2 rows x 2 columns)
 * // Input: [[0, 5], [0, 0]]
 * // numCols = 2; row 0 length = 2; row 1 length = 2.
 * // Output: true
 * isMatrixValid([[0, 5], [0, 0]]) // => true
 *
 * @example
 * // Example 4: Non-uniform / ragged matrix (decisive failure transition)
 * // Input: [[1, 2], [3]]
 * // numCols = 2; row 0 length = 2; row 1 length = 1 !== 2 (decisive transition -> false).
 * // Output: false
 * isMatrixValid([[1, 2], [3]]) // => false
 */
const isMatrixValid = (matrix) => {
  // Check for input other than a non-empty 2D matrix
  if (
    !Array.isArray(matrix) ||
    matrix.length === 0 ||
    !Array.isArray(matrix[0])
  ) {
    return false
  }

  const numRows = matrix.length
  const numCols = matrix[0].length

  for (let i = 0; i < numRows; i++) {
    // Decisive transition: any row length deviation marks the matrix as invalid
    if (!Array.isArray(matrix[i]) || matrix[i].length !== numCols) {
      return false
    }
  }

  return true
}

const checkNonZero = (currentRow, currentCol, matrix) => {
  let numRows = matrix.length
  for (let i = currentRow; i < numRows; i++) {
    // Checks if the current element is not very near to zero.
    if (!isTolerant(0, matrix[i][currentCol], tolerance)) {
      return true
    }
  }
  return false
}

const swapRows = (currentRow, withRow, matrix) => {
  let numCols = matrix[0].length
  let tempValue = 0
  for (let j = 0; j < numCols; j++) {
    tempValue = matrix[currentRow][j]
    matrix[currentRow][j] = matrix[withRow][j]
    matrix[withRow][j] = tempValue
  }
}

// Select a pivot element in the current column to facilitate row operations.
// Pivot element is the first non-zero element found from the current row
// down to the last row.
const selectPivot = (currentRow, currentCol, matrix) => {
  let numRows = matrix.length
  for (let i = currentRow; i < numRows; i++) {
    if (matrix[i][currentCol] !== 0) {
      swapRows(currentRow, i, matrix)
      return
    }
  }
}

// Multiply each element of the given row with a factor.
const scalarMultiplication = (currentRow, factor, matrix) => {
  let numCols = matrix[0].length
  for (let j = 0; j < numCols; j++) {
    matrix[currentRow][j] *= factor
  }
}

// Subtract one row from another row
const subtractRow = (currentRow, fromRow, matrix) => {
  let numCols = matrix[0].length
  for (let j = 0; j < numCols; j++) {
    matrix[fromRow][j] -= matrix[currentRow][j]
  }
}

// Check if two numbers are equal within a given tolerance
const isTolerant = (a, b, tolerance) => {
  const absoluteDifference = Math.abs(a - b)
  return absoluteDifference <= tolerance
}

const rowEchelon = (matrix) => {
  // Check if the input matrix is valid; if not, throw an error.
  if (!isMatrixValid(matrix)) {
    throw new Error('Input is not a valid 2D matrix.')
  }

  let numRows = matrix.length
  let numCols = matrix[0].length
  let result = matrix

  // Iterate through the rows (i) and columns (j) of the matrix.
  for (let i = 0, j = 0; i < numRows && j < numCols; ) {
    // If the current column has all zero elements below the current row,
    // move to the next column.
    if (!checkNonZero(i, j, result)) {
      j++
      continue
    }

    // Select a pivot element and normalize the current row.
    selectPivot(i, j, result)
    let factor = 1 / result[i][j]
    scalarMultiplication(i, factor, result)

    // Make elements below the pivot element zero by performing
    // row operations on subsequent rows.
    for (let x = i + 1; x < numRows; x++) {
      factor = result[x][j]
      if (isTolerant(0, factor, tolerance)) {
        continue
      }
      scalarMultiplication(i, factor, result)
      subtractRow(i, x, result)
      factor = 1 / factor
      scalarMultiplication(i, factor, result)
    }
    i++
  }
  return result
}

export { rowEchelon, isMatrixValid }
