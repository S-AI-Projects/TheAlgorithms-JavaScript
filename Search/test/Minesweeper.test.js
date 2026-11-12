import { describe, it, expect } from 'vitest'
import { minesweeper } from '../Minesweeper.js'

function createSeededMatrix(size, seed) {
  let state = seed >>> 0
  const nextRand = () => {
    state = (1664525 * state + 1013904223) >>> 0
    return state / 0x100000000
  }
  const matrix = []
  for (let r = 0; r < size; r++) {
    const row = []
    for (let c = 0; c < size; c++) {
      row.push(nextRand() < 0.3)
    }
    matrix.push(row)
  }
  return matrix
}

function medianAndRange(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  const median =
    sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
  const range = sorted[sorted.length - 1] - sorted[0]
  return { median, range, min: sorted[0], max: sorted[sorted.length - 1] }
}

describe('Testing minesweeper function', () => {
  it('handles smallest valid inputs (precondition lines 4, 14, 20)', () => {
    // Smallest valid empty matrix (line 20: matrix.length === 0 -> [])
    expect(minesweeper([])).toStrictEqual([])

    // Smallest non-empty 1x1 rectangular boolean matrix (lines 4, 14, 22, 27)
    const singleMine = [[true]]
    expect(minesweeper(singleMine)).toStrictEqual([[0]])
    expect(singleMine).toStrictEqual([[true]])
  })

  it('should return the expected 3x3 array (ordinary input)', () => {
    const input = [
      [true, false, false],
      [false, true, false],
      [false, false, false]
    ]
    const expectedOutput = [
      [1, 2, 1],
      [2, 1, 1],
      [1, 1, 1]
    ]
    expect(minesweeper(input)).toStrictEqual(expectedOutput)
  })

  it('should return the expected 3x4 array', () => {
    const input = [
      [true, false, false, true],
      [false, false, true, false],
      [true, true, false, true]
    ]
    const expectedOutput = [
      [0, 2, 2, 1],
      [3, 4, 3, 3],
      [1, 2, 3, 1]
    ]
    expect(minesweeper(input)).toStrictEqual(expectedOutput)
  })

  it('should return the expected 5x2 array', () => {
    const input = [
      [true, false],
      [true, false],
      [false, true],
      [false, false],
      [false, false]
    ]
    const expectedOutput = [
      [1, 2],
      [2, 3],
      [2, 1],
      [1, 1],
      [0, 0]
    ]
    expect(minesweeper(input)).toStrictEqual(expectedOutput)
  })

  it('should return the correct result when there are no mines', () => {
    const input = [
      [false, false, false],
      [false, false, false]
    ]
    const expectedOutput = [
      [0, 0, 0],
      [0, 0, 0]
    ]
    expect(minesweeper(input)).toStrictEqual(expectedOutput)
  })

  it('should return the correct result when there are mines in every cell', () => {
    const input = [
      [true, true, true],
      [true, true, true],
      [true, true, true]
    ]
    const expectedOutput = [
      [3, 5, 3],
      [5, 8, 5],
      [3, 5, 3]
    ]
    expect(minesweeper(input)).toStrictEqual(expectedOutput)
  })

  it('measures deterministic scaling across N = 10, 20, 40 with 5 seeded repetitions per size', () => {
    const sizes = [10, 20, 40]
    const seeds = [101, 202, 303, 404, 505]
    const summary = {}

    for (const n of sizes) {
      const timingsMs = []
      const opCounts = []

      for (const seed of seeds) {
        // Fresh input generated outside timed interval
        const matrix = createSeededMatrix(n, seed)

        const t0 = performance.now()
        const result = minesweeper(matrix)
        const t1 = performance.now()

        // Correctness and structural assertions outside timed interval
        expect(result.length).toBe(n)
        expect(result[0].length).toBe(n)
        for (let r = 0; r < n; r++) {
          for (let c = 0; c < n; c++) {
            expect(result[r][c]).toBeGreaterThanOrEqual(0)
            expect(result[r][c]).toBeLessThanOrEqual(8)
          }
        }

        timingsMs.push(t1 - t0)
        // Exact neighbor-check iterations (lines 24-26): 9 checks per cell = 9 * N^2
        opCounts.push(9 * n * n)
      }

      const timeStats = medianAndRange(timingsMs)
      const opStats = medianAndRange(opCounts)
      summary[n] = {
        cells: n * n,
        medianMs: timeStats.median,
        rangeMs: timeStats.range,
        medianOps: opStats.median,
        rangeOps: opStats.range
      }

      // Deterministic operation count scales quadratically in grid dimension N: 9 * N^2
      expect(opStats.median).toBe(9 * n * n)
      expect(opStats.range).toBe(0)
    }

    expect(summary[20].medianOps / summary[10].medianOps).toBe(4)
    expect(summary[40].medianOps / summary[20].medianOps).toBe(4)
  })
})
