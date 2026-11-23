// R50-T007 evidence: hand-calculated states for DisjointSetTreeNode compared
// with a traced execution of the real source, printed as JSON rows.
import { execFileSync } from 'child_process'
import {
  copyFileSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import {
  DisjointSetTreeNode,
  DisjointSetTree,
  GraphWeightedUndirectedAdjacencyList
} from '../../Graphs/KruskalMST.js'

const SRC = 'KruskalMST.js'
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const row = (name, input, expected, actual, precondition) => ({
  name,
  input,
  expected,
  actual,
  pass: same(expected, actual),
  precondition
})

const node = new DisjointSetTreeNode('a')
const rows = [
  row(
    'smallest valid input: new node',
    "new DisjointSetTreeNode('a')",
    { key: 'a', parentIsSelf: true, rank: 0 },
    { key: node.key, parentIsSelf: node.parent === node, rank: node.rank },
    `${SRC}:38-39 parent = this, rank = 0`
  )
]

// state = [parent key of a, b, c] and [rank of a, b, c]
const state = (s) => ({
  parents: ['a', 'b', 'c'].map((k) => s.map[k].parent.key),
  ranks: ['a', 'b', 'c'].map((k) => s.map[k].rank)
})
const sets = new DisjointSetTree()
sets.makeSet('a')
sets.makeSet('b')
sets.makeSet('c')
rows.push(
  row(
    'after makeSet a, b, c',
    'makeSet x3',
    { parents: ['a', 'b', 'c'], ranks: [0, 0, 0] },
    state(sets),
    `${SRC}:50-53 makeSet creates a root node`
  )
)
sets.union('a', 'b')
rows.push(
  row(
    "after union('a', 'b') — equal ranks (decisive transition)",
    "union('a', 'b')",
    { parents: ['b', 'b', 'c'], ranks: [0, 1, 0] },
    state(sets),
    `${SRC}:73-75 x.parent = y; equal ranks -> y.rank += 1`
  )
)
sets.union('c', 'a')
rows.push(
  row(
    "after union('c', 'a') — ranks 0 vs 1",
    "union('c', 'a')",
    { parents: ['b', 'b', 'b'], ranks: [0, 1, 0] },
    state(sets),
    `${SRC}:68-78 lower rank goes below, no rank change`
  )
)

const graph = new GraphWeightedUndirectedAdjacencyList()
graph.addEdge(1, 2, 1)
graph.addEdge(2, 3, 2)
graph.addEdge(3, 4, 1)
graph.addEdge(3, 5, 100)
graph.addEdge(4, 5, 5)
const mst = graph.KruskalMST().connections
const sortKeys = (o) =>
  Object.fromEntries(
    Object.keys(o)
      .sort()
      .map((k) => [k, typeof o[k] === 'object' ? sortKeys(o[k]) : o[k]])
  )
rows.push(
  row(
    'KruskalMST on the example at the bottom of the file',
    '1-2:1, 2-3:2, 3-4:1, 3-5:100, 4-5:5',
    {
      1: { 2: 1 },
      2: { 1: 1, 3: 2 },
      3: { 2: 2, 4: 1 },
      4: { 3: 1, 5: 5 },
      5: { 4: 5 }
    },
    sortKeys(mst),
    `${SRC}: KruskalMST uses DisjointSetTree to skip 3-5`
  )
)

// Run the @example exactly as written (real import line, real console) as an
// ES module placed next to a copy of KruskalMST.js, and compare its stdout
// with the output documented in the comments.
const sourceUrl = new URL('../../Graphs/KruskalMST.js', import.meta.url)
const source = readFileSync(sourceUrl, 'utf8')
const start = source.indexOf('@example')
const exampleLines = source
  .slice(start + '@example'.length, source.indexOf('*/', start))
  .split('\n')
  .map((line) => line.replace(/^\s*\* ?/, ''))
const documented = exampleLines
  .filter((line) => line.includes('console.log('))
  .map((line) => line.split('// ')[1].trim())
const dir = mkdtempSync(join(tmpdir(), 'R50-T007-example-'))
let printed
try {
  copyFileSync(sourceUrl, join(dir, 'KruskalMST.js'))
  writeFileSync(join(dir, 'package.json'), '{"type":"module"}')
  writeFileSync(join(dir, 'example.js'), exampleLines.join('\n'))
  printed = execFileSync(process.execPath, [join(dir, 'example.js')], {
    encoding: 'utf8'
  })
    .trim()
    .split('\n')
} finally {
  rmSync(dir, { recursive: true, force: true })
}
rows.push(
  row(
    'JSDoc @example run verbatim with node (stdout vs documented comments)',
    exampleLines.filter((l) => l.trim()).length + ' example lines',
    ['a true 0', 'b 1', 'b 1', '0 0'],
    printed,
    `${SRC}:17-33 @example block`
  )
)
rows.push(
  row(
    'documented comments match the pinned output',
    'comments after each console.log',
    ['a true 0', 'b 1', 'b 1', '0 0'],
    documented,
    `${SRC}:21,29,32,33`
  )
)

console.log(JSON.stringify(rows))
