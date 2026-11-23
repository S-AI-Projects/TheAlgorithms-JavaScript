// Evaluates the R50-T005 fixture against the real source and prints JSON rows.
// Expected grids were worked out by hand from the rules at lines 4-6.
import { readFileSync } from 'fs'
import { newGeneration } from '../../Cellular-Automata/ConwaysGameOfLife.js'

const SRC = 'ConwaysGameOfLife.js'
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const glider = () => [
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]
]
const gliderNext = [
  [0, 0, 0, 0, 0],
  [1, 0, 1, 0, 0],
  [0, 1, 1, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0]
]

const row = (name, input, expected, actual, precondition) => ({
  name,
  input,
  expected,
  actual,
  pass: same(expected, actual),
  precondition
})

const rows = [
  row(
    'smallest valid input: empty grid',
    [],
    [],
    newGeneration([]),
    `${SRC}:24-25 loops over cells.length (0 rows)`
  ),
  row(
    'smallest non-empty grid: lone cell dies',
    [[1]],
    [[0]],
    newGeneration([[1]]),
    `${SRC}:6 rule 3, live cell with 0 neighbours dies`
  ),
  row(
    'ordinary input: glider step',
    glider(),
    gliderNext,
    newGeneration(glider()),
    `${SRC}:4-5 rules 1 and 2`
  )
]

// Input isolation
const input = glider()
const output = newGeneration(input)
rows.push(
  row(
    'input grid unchanged after call',
    glider(),
    glider(),
    input,
    `${SRC}:43 cells are only read`
  )
)
rows.push(
  row(
    'output shares no rows with input',
    'glider',
    { sameGrid: false, sharedRows: 0 },
    {
      sameGrid: output === input,
      sharedRows: output.filter((r, i) => r === input[i]).length
    },
    `${SRC}:25,27 new arrays are created`
  )
)

// Repeatability: twice in fresh state, then once after another input.
const runs = [newGeneration(glider()), newGeneration(glider())]
const other = newGeneration([
  [1, 1],
  [1, 1]
])
other[0][0] = 0
runs.push(newGeneration(glider()))
rows.push(
  row(
    'glider run twice, then again after another input (result tampered)',
    'glider x3',
    [gliderNext, gliderNext, gliderNext],
    runs,
    `${SRC}:24 no module-level state`
  )
)

// Dependency scan of the real source with comments removed: any use of time,
// randomness, I/O, globals or imports, and any module-level variables.
const code = readFileSync(
  new URL('../../Cellular-Automata/ConwaysGameOfLife.js', import.meta.url),
  'utf8'
)
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/.*$/gm, '')
const suspects =
  /\b(Date|Math|performance|process|require|import|fetch|XMLHttpRequest|console|setTimeout|setInterval|globalThis|window|document|localStorage|crypto)\b/g
rows.push(
  row(
    'external dependencies found by scanning the source (comments removed)',
    'Date, Math, performance, process, require, import, fetch, console, timers, globals',
    [],
    [...new Set(code.match(suspects) || [])],
    `${SRC}:24-54 body uses only its parameter and local variables`
  )
)
rows.push(
  row(
    'module-level variables (shared state between calls)',
    'top-level let/var/const declarations',
    [],
    code.split('\n').filter((l) => /^(let|var|const)\s/.test(l)),
    `${SRC}: only an exported function is declared`
  )
)

// Runtime proof of no mutation: a deeply frozen grid would make any write
// throw in an ES module (strict mode).
const frozen = Object.freeze(glider().map((r) => Object.freeze(r)))
rows.push(
  row(
    'deeply frozen input is accepted (no write is attempted)',
    'Object.freeze(glider)',
    gliderNext,
    (() => {
      try {
        return newGeneration(frozen)
      } catch (e) {
        return `throws: ${e.message}`
      }
    })(),
    `${SRC}:43 cells are only read`
  )
)

console.log(JSON.stringify(rows))
