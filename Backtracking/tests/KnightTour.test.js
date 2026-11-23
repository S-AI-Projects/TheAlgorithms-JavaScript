import { OpenKnightTour } from '../KnightTour'

describe('OpenKnightTour', () => {
  it('OpenKnightTour(5)', () => {
    const KT = new OpenKnightTour(5)
    expect(KT.board).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ])

    expect(KT.solve()).toBe(true)
    expect(KT.board).toEqual([
      [19, 4, 15, 10, 25],
      [14, 9, 18, 5, 16],
      [1, 20, 3, 24, 11],
      [8, 13, 22, 17, 6],
      [21, 2, 7, 12, 23]
    ])
  })

  it('OpenKnightTour(2)', () => {
    const KT = new OpenKnightTour(2)
    expect(KT.board).toEqual([
      [0, 0],
      [0, 0]
    ])

    expect(KT.solve()).toBe(false)
    expect(KT.board).toEqual([
      [0, 0],
      [0, 0]
    ])
  })
})

// Mutation-resistant regressions for OpenKnightTour (KnightTour.js line 3).
// They check properties of the result instead of only one exact board, so a
// one-line mistake in the bounds check or in the backtracking reset fails.

// Independent check: the board holds each of 1..n*n exactly once and every
// step k -> k + 1 is a knight move. Does not call any OpenKnightTour method.
const tourProblems = (board) => {
  const n = board.length
  const where = new Map()
  board.forEach((row, y) =>
    row.forEach((value, x) => {
      if (where.has(value)) where.set(value, null)
      else where.set(value, [y, x])
    })
  )
  const problems = []
  for (let k = 1; k <= n * n; k++) {
    if (!where.get(k)) problems.push(`value ${k} missing or repeated`)
  }
  for (let k = 1; k < n * n; k++) {
    const a = where.get(k)
    const b = where.get(k + 1)
    if (!a || !b) continue
    const dy = Math.abs(a[0] - b[0])
    const dx = Math.abs(a[1] - b[1])
    if (!((dy === 1 && dx === 2) || (dy === 2 && dx === 1))) {
      problems.push(`step ${k} -> ${k + 1} is not a knight move`)
    }
  }
  return problems
}

describe('OpenKnightTour invariants', () => {
  // Smallest valid input. solve() starts each search with curr = 0 and never
  // numbers the starting square (line 38), so a 1x1 board cannot be filled.
  it('smallest board 1x1: no tour found, board untouched', () => {
    const KT = new OpenKnightTour(1)
    expect(KT.solve()).toBe(false)
    expect(KT.board).toEqual([[0]])
  })

  // Protected condition: backtracking undoes every placement (line 58).
  it('failed search on 3x3 leaves the board all zeros', () => {
    const KT = new OpenKnightTour(3)
    expect(KT.solve()).toBe(false)
    expect(KT.board).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ])
  })

  it('5x5 solution is a valid open tour using 1..25 once each', () => {
    const KT = new OpenKnightTour(5)
    expect(KT.solve()).toBe(true)
    expect(tourProblems(KT.board)).toEqual([])
  })

  // Protected condition: the bounds filter keeps row 0 and column 0 (line 25).
  it('getMoves keeps moves onto row 0 and column 0', () => {
    // From [1, 2] on 3x3 only [2, 0] and [0, 0] are on the board,
    // in the order they appear in the move list (lines 12-21).
    expect(new OpenKnightTour(3).getMoves([1, 2])).toEqual([
      [2, 0],
      [0, 0]
    ])
    expect(new OpenKnightTour(5).getMoves([0, 0])).toEqual([
      [2, 1],
      [1, 2]
    ])
  })

  it('fresh equivalent instances give identical results', () => {
    // No external state is involved (printBoard is not called), so two fresh
    // 5x5 instances must produce the same explicit board.
    const expectedBoard = [
      [19, 4, 15, 10, 25],
      [14, 9, 18, 5, 16],
      [1, 20, 3, 24, 11],
      [8, 13, 22, 17, 6],
      [21, 2, 7, 12, 23]
    ]
    const first = new OpenKnightTour(5)
    const second = new OpenKnightTour(5)
    expect(first.solve()).toBe(true)
    expect(second.solve()).toBe(true)
    expect(first.board).toEqual(expectedBoard)
    expect(second.board).toEqual(expectedBoard)
    expect(first.board).not.toBe(second.board)
  })
})
