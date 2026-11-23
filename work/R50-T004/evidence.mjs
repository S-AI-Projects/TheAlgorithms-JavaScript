// Evaluates the R50-T004 fixture and the seeded property run against the real
// source and prints JSON rows. Expected outputs were written before running.
import { oddEvenSort, swap } from '../../Sorts/OddEvenSort.js'

const SRC = 'OddEvenSort.js'
const fixture = [
  [
    [3, 1, 2],
    [1, 2, 3]
  ],
  [
    [2, 2, 1],
    [1, 2, 2]
  ],
  [
    [1, 2, 3],
    [1, 2, 3]
  ],
  [
    [3, 2, 1],
    [1, 2, 3]
  ],
  [[], []],
  [[7], [7]]
]

const rows = fixture.map(([input, expected]) => {
  const arr = [...input]
  const result = oddEvenSort(arr)
  const same = result === arr
  return {
    name: `oddEvenSort(${JSON.stringify(input)})`,
    input,
    expected: { result: expected, returnsSameArray: true },
    actual: { result, returnsSameArray: same },
    pass: JSON.stringify(result) === JSON.stringify(expected) && same,
    precondition: `${SRC}:41 ascending, in place, returns arr (line 58)`
  }
})

const a = [3, 1, 2]
const ret = swap(a, 0, 1)
rows.push({
  name: 'swap([3, 1, 2], 0, 1)',
  input: [[3, 1, 2], 0, 1],
  expected: { arr: [1, 3, 2], returned: 'undefined' },
  actual: { arr: a, returned: String(ret) },
  pass: JSON.stringify(a) === '[1,3,2]' && ret === undefined,
  precondition: `${SRC}:22-26 swap mutates arr, returns nothing`
})

// Seeded property run (same generator as the Vitest file).
const mulberry32 = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const random = mulberry32(20261123)
const counts = (arr) => {
  const m = new Map()
  for (const v of arr) m.set(v, (m.get(v) || 0) + 1)
  return JSON.stringify([...m.entries()].sort((x, y) => x[0] - y[0]))
}
let ordered = 0
let multiplicities = 0
for (let n = 0; n < 100; n++) {
  const length = Math.floor(random() * 13)
  const values = []
  for (let k = 0; k < length; k++) values.push(Math.floor(random() * 11) - 5)
  const sorted = oddEvenSort([...values])
  if (sorted.every((v, k) => k === 0 || sorted[k - 1] <= v)) ordered++
  if (counts(sorted) === counts(values)) multiplicities++
}
rows.push({
  name: 'property run: 100 cases, seed 20261123, length 0..12, values -5..5',
  input: { seed: 20261123, cases: 100 },
  expected: { ordered: 100, multiplicitiesPreserved: 100 },
  actual: { ordered, multiplicitiesPreserved: multiplicities },
  pass: ordered === 100 && multiplicities === 100,
  precondition: `${SRC}:46,52 numbers compared with >`
})

console.log(JSON.stringify(rows))
