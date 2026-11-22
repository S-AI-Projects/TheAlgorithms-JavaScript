import { rowEchelon, isMatrixValid } from '../RowEchelon'
describe('Determinant', () => {
  const tolerance = 0.000001
  test.each([
    [
      [
        [8, 1, 3, 5],
        [4, 6, 8, 2],
        [3, 5, 6, 8]
      ],
      [
        [1, 0.125, 0.375, 0.625],
        [0, 1, 1.18182, -0.09091],
        [0, 0, 1, -11.0769]
      ]
    ],
    [
      [
        [6, 8, 1, 3, 5],
        [1, 4, 6, 8, 2],
        [0, 3, 5, 6, 8],
        [2, 5, 9, 7, 8],
        [5, 5, 7, 0, 1]
      ],
      [
        [1, 1.33333, 0.16667, 0.5, 0.83333],
        [0, 1, 2.1875, 2.8125, 0.4375],
        [0, 0, 1, 1.56, -4.28003],
        [0, 0, 0, 1, -3.3595],
        [0, 0, 0, 0, 1]
      ]
    ],
    [
      [
        [1, 3, 5],
        [6, 8, 2],
        [5, 6, 8],
        [7, 9, 9],
        [5, 0, 6]
      ],
      [
        [1, 3, 5],
        [0, 1, 2.8],
        [0, 0, 1],
        [0, 0, 0],
        [0, 0, 0]
      ]
    ],
    [
      [
        [0, 7, 8, 1, 3, 5],
        [0, 6, 4, 6, 8, 2],
        [0, 7, 3, 5, 6, 8],
        [6, 8, 1, 0, 0, 4],
        [3, 3, 5, 7, 3, 1],
        [1, 2, 1, 0, 9, 7],
        [8, 8, 0, 2, 3, 1]
      ],
      [
        [1, 1.33333, 0.16667, 0, 0, 0.66667],
        [0, 1, 0.66667, 1, 1.33333, 0.33333],
        [0, 0, 1, 1.2, 1.99999, -3.4],
        [0, 0, 0, 1, 1.3, -1.4],
        [0, 0, 0, 0, 1, -2.32854],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0]
      ]
    ]
  ])('Should return the matrix in row echelon form.', (matrix, expected) => {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        expect(rowEchelon(matrix)[i][j]).toBeCloseTo(expected[i][j], tolerance)
      }
    }
  })

  test.each([
    [
      [
        [8, 1, 3, 5],
        [4, 6, 8, 2, 7],
        [3, 5, 6, 8]
      ],
      'Input is not a valid 2D matrix.'
    ]
  ])('Should return the error message.', (matrix, expected) => {
    expect(() => rowEchelon(matrix)).toThrowError(expected)
  })
})

describe('isMatrixValid', () => {
  test('validates small rectangular matrix fixture', () => {
    const rectangularMatrix = [
      [1, 2, 3],
      [4, 5, 6]
    ]
    expect(isMatrixValid(rectangularMatrix)).toBe(true)

    const tallRectangularMatrix = [
      [1, 2],
      [3, 4],
      [5, 6]
    ]
    expect(isMatrixValid(tallRectangularMatrix)).toBe(true)
  })

  test('validates 1x1 matrix fixture', () => {
    const singleElementMatrix = [[42]]
    expect(isMatrixValid(singleElementMatrix)).toBe(true)

    const singleZeroMatrix = [[0]]
    expect(isMatrixValid(singleZeroMatrix)).toBe(true)
  })

  test('validates zero-containing matrix fixture', () => {
    const zeroContainingMatrix = [
      [0, 5],
      [0, 0]
    ]
    expect(isMatrixValid(zeroContainingMatrix)).toBe(true)

    const allZeroRectangular = [
      [0, 0, 0],
      [0, 0, 0]
    ]
    expect(isMatrixValid(allZeroRectangular)).toBe(true)
  })

  test('executes and asserts JSDoc documentation examples', () => {
    // Example 1: Small rectangular matrix (2x3)
    expect(
      isMatrixValid([
        [1, 2, 3],
        [4, 5, 6]
      ])
    ).toBe(true)

    // Example 2: 1x1 matrix
    expect(isMatrixValid([[42]])).toBe(true)

    // Example 3: Zero-containing matrix (2x2)
    expect(
      isMatrixValid([
        [0, 5],
        [0, 0]
      ])
    ).toBe(true)

    // Example 4: Non-uniform / ragged matrix (decisive failure transition)
    expect(isMatrixValid([[1, 2], [3]])).toBe(false)
  })

  test('rejects ragged matrices (decisive row length transition)', () => {
    expect(
      isMatrixValid([
        [1, 2, 3],
        [4, 5]
      ])
    ).toBe(false)
    expect(
      isMatrixValid([
        [1, 2],
        [3, 4, 5]
      ])
    ).toBe(false)
  })

  test('rejects non-matrix inputs and empty structures', () => {
    expect(isMatrixValid([])).toBe(false)
    expect(isMatrixValid(null)).toBe(false)
    expect(isMatrixValid(undefined)).toBe(false)
    expect(isMatrixValid('not a matrix')).toBe(false)
    expect(isMatrixValid(123)).toBe(false)
    expect(isMatrixValid([1, 2, 3])).toBe(false)
    expect(isMatrixValid([[1, 2], 'not an array'])).toBe(false)
  })

  test('works consistently with rowEchelon on valid fixtures', () => {
    // 1x1 matrix in rowEchelon
    expect(rowEchelon([[42]])).toEqual([[1]])

    // Rectangular 2x3 matrix in rowEchelon
    const rect = [
      [1, 2, 3],
      [4, 5, 6]
    ]
    const rectResult = rowEchelon(rect)
    expect(rectResult.length).toBe(2)
    expect(rectResult[0].length).toBe(3)
    expect(rectResult[0][0]).toBeCloseTo(1)
    expect(rectResult[1][0]).toBeCloseTo(0)

    // Zero-containing matrix in rowEchelon
    const zeroMat = [
      [0, 2],
      [3, 0]
    ]
    const zeroResult = rowEchelon(zeroMat)
    expect(zeroResult[0][0]).toBeCloseTo(1)
    expect(zeroResult[1][0]).toBeCloseTo(0)
    expect(zeroResult[1][1]).toBeCloseTo(1)
  })
})
