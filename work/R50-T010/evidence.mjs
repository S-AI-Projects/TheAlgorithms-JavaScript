// R50-T010 evidence: fixture results for OpenKnightTour on the real source and
// on two in-memory mutants (the file on disk is never changed).
import { readFileSync } from 'fs'
import { OpenKnightTour } from '../../Backtracking/KnightTour.js'

const SRC = 'KnightTour.js'
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const source = readFileSync(
  new URL('../../Backtracking/KnightTour.js', import.meta.url),
  'utf8'
)
const loadVariant = async (find, replace) => {
  if (!source.includes(find)) throw new Error(`pattern not found: ${find}`)
  const code = source.replace(find, replace)
  return (await import('data:text/javascript,' + encodeURIComponent(code)))
    .OpenKnightTour
}
const NoReset = await loadVariant('        this.board[y][x] = 0\n', '')
const RowOff = await loadVariant(
  'y >= 0 && y < this.size',
  'y > 0 && y < this.size'
)

// Same independent tour check as the Vitest file.
const tourProblems = (board) => {
  const n = board.length
  const where = new Map()
  board.forEach((row, y) =>
    row.forEach((v, x) => where.set(v, where.has(v) ? null : [y, x]))
  )
  let problems = 0
  for (let k = 1; k <= n * n; k++) if (!where.get(k)) problems++
  for (let k = 1; k < n * n; k++) {
    const a = where.get(k)
    const b = where.get(k + 1)
    if (!a || !b) continue
    const d = [Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])].sort().join()
    if (d !== '1,2') problems++
  }
  return problems
}

const solveRun = (Cls, n) => {
  const kt = new Cls(n)
  const solved = kt.solve()
  return {
    solved,
    board: kt.board,
    tourProblems: solved ? tourProblems(kt.board) : null
  }
}

const rows = []
const add = (name, input, expected, actual, precondition) =>
  rows.push({
    name,
    input,
    expected,
    actual,
    pass: same(expected, actual),
    precondition
  })

// Original implementation: must satisfy the expected outputs.
add(
  'original: smallest board n = 1',
  1,
  { solved: false, board: [[0]], tourProblems: null },
  solveRun(OpenKnightTour, 1),
  `${SRC}:38 start square is not numbered (curr = 0)`
)
add(
  'original: n = 3 failed search leaves zeros',
  3,
  {
    solved: false,
    board: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ],
    tourProblems: null
  },
  solveRun(OpenKnightTour, 3),
  `${SRC}:58 backtracking reset`
)
const five = solveRun(OpenKnightTour, 5)
add(
  'original: n = 5 is a valid tour',
  5,
  { solved: true, tourProblems: 0 },
  { solved: five.solved, tourProblems: five.tourProblems },
  `${SRC}:24-26 in-bounds moves only; :58 reset`
)
add(
  'original: getMoves([1, 2]) on 3x3',
  [3, [1, 2]],
  [
    [2, 0],
    [0, 0]
  ],
  new OpenKnightTour(3).getMoves([1, 2]),
  `${SRC}:25 y >= 0 keeps row 0`
)

// Mutants: these rows record how each mutant differs from the expected
// output. `pass` here means "the mutant was distinguished".
const mutantRow = (
  name,
  input,
  expectedForOriginal,
  mutantActual,
  precondition
) =>
  rows.push({
    name,
    input,
    expected: { differsFrom: expectedForOriginal },
    actual: mutantActual,
    pass: !same(expectedForOriginal, mutantActual),
    precondition
  })
const m3 = solveRun(NoReset, 3)
mutantRow(
  'mutant (no reset): n = 3 board',
  3,
  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ],
  m3.board,
  `${SRC}:58 removed`
)
const m5 = solveRun(NoReset, 5)
mutantRow(
  'mutant (no reset): n = 5 tour problems',
  5,
  0,
  m5.tourProblems,
  `${SRC}:58 removed`
)
mutantRow(
  'mutant (y > 0): getMoves([1, 2]) on 3x3',
  [3, [1, 2]],
  [
    [2, 0],
    [0, 0]
  ],
  new RowOff(3).getMoves([1, 2]),
  `${SRC}:25 changed`
)

console.log(JSON.stringify(rows))
