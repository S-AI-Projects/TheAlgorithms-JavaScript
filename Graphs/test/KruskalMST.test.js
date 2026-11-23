import { readFileSync } from 'fs'
import * as KruskalModule from '../KruskalMST'
import {
  DisjointSetTreeNode,
  DisjointSetTree,
  GraphWeightedUndirectedAdjacencyList
} from '../KruskalMST'

// Pull the @example block out of the DisjointSetTreeNode JSDoc
// (KruskalMST.js, above the class) so the documentation itself is executed.
const readDocExample = () => {
  const source = readFileSync(
    new URL('../KruskalMST.js', import.meta.url),
    'utf8'
  )
  const start = source.indexOf('@example')
  const end = source.indexOf('*/', start)
  const lines = source
    .slice(start + '@example'.length, end)
    .split('\n')
    .map((line) => line.replace(/^\s*\* ?/, ''))
  const importLine = lines.find((line) => line.startsWith('import '))
  const [, names, from] = importLine.match(/^import \{ (.+) \} from '(.+)'$/)
  return {
    importedNames: names.split(',').map((name) => name.trim()),
    importedFrom: from,
    body: lines.filter((line) => !line.startsWith('import ')).join('\n'),
    documented: lines
      .filter((line) => line.includes('console.log('))
      .map((line) => line.split('// ')[1].trim())
  }
}

describe('DisjointSetTreeNode documentation example', () => {
  const example = readDocExample()

  it('imports real public names from this file', () => {
    expect(example.importedFrom).toBe('./KruskalMST.js')
    expect(example.importedNames).toEqual([
      'DisjointSetTreeNode',
      'DisjointSetTree'
    ])
    for (const name of example.importedNames) {
      expect(typeof KruskalModule[name]).toBe('function')
    }
  })

  it('prints exactly what the comments next to each console.log say', () => {
    const printed = []
    const fakeConsole = {
      log: (...args) => printed.push(args.map(String).join(' '))
    }
    // Run the example body with exactly the names its import line binds.
    new Function(...example.importedNames, 'console', example.body)(
      ...example.importedNames.map((name) => KruskalModule[name]),
      fakeConsole
    )

    // The documented output, pinned so the doc cannot drift silently.
    expect(example.documented).toEqual(['a true 0', 'b 1', 'b 1', '0 0'])
    expect(printed).toEqual(['a true 0', 'b 1', 'b 1', '0 0'])
  })
})

describe('DisjointSetTreeNode states (calculated by hand)', () => {
  // Precondition: constructor sets parent = this and rank = 0
  // (KruskalMST.js lines 38-39).
  it('smallest valid input: a new node is the root of its own set', () => {
    const node = new DisjointSetTreeNode('a')
    expect(node.key).toBe('a')
    expect(node.parent).toBe(node)
    expect(node.rank).toBe(0)
  })

  // Precondition: link joins x below y and bumps y.rank only on equal ranks
  // (KruskalMST.js lines 68-78).
  it('ordinary input: union of equal ranks, then unequal ranks', () => {
    const sets = new DisjointSetTree()
    sets.makeSet('a')
    sets.makeSet('b')
    sets.makeSet('c')

    sets.union('a', 'b') // ranks 0 and 0
    expect(sets.map.a.parent).toBe(sets.map.b)
    expect(sets.map.b.parent).toBe(sets.map.b)
    expect([sets.map.a.rank, sets.map.b.rank, sets.map.c.rank]).toEqual([
      0, 1, 0
    ])

    sets.union('c', 'a') // root c has rank 0, root b has rank 1
    expect(sets.map.c.parent).toBe(sets.map.b)
    expect(sets.findSet('c')).toBe(sets.map.b)
    expect([sets.map.a.rank, sets.map.b.rank, sets.map.c.rank]).toEqual([
      0, 1, 0
    ])
  })
})

describe('KruskalMST example from the bottom of KruskalMST.js', () => {
  it('keeps the 4 cheapest edges that do not form a cycle', () => {
    const graph = new GraphWeightedUndirectedAdjacencyList()
    graph.addEdge(1, 2, 1)
    graph.addEdge(2, 3, 2)
    graph.addEdge(3, 4, 1)
    graph.addEdge(3, 5, 100) // Removed in MST
    graph.addEdge(4, 5, 5)

    // Sorted edges: 1-2 (1), 3-4 (1), 2-3 (2), 4-5 (5), 3-5 (100).
    // The first four join new sets; 3-5 would close a cycle.
    expect(graph.KruskalMST().connections).toEqual({
      1: { 2: 1 },
      2: { 1: 1, 3: 2 },
      3: { 2: 2, 4: 1 },
      4: { 3: 1, 5: 5 },
      5: { 4: 5 }
    })
  })
})
