// R50-T008 evidence: absent-result paths of the Trie / TrieNode, evaluated on
// the real source. Expected values were written before running.
import { readFileSync } from 'fs'
import { Trie, TrieNode } from '../../Data-Structures/Tree/Trie.js'

const SRC = 'Trie.js'
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const build = () => {
  const t = new Trie()
  t.insert('car')
  t.insert('cat')
  t.insert('dog')
  return t
}
const row = (name, input, expected, actual, precondition) => ({
  name,
  input,
  expected,
  actual,
  pass: same(expected, actual),
  precondition
})

const t = build()
const node = new TrieNode('c')
const rows = [
  row(
    'TrieNode without parent',
    "new TrieNode('c')",
    { parent: null, count: 0 },
    { parent: node.parent, count: node.count },
    `${SRC}:21-22 undefined parent -> null`
  ),
  row(
    "findPrefix('cab') hits the no-such-prefix branch",
    'cab',
    null,
    t.findPrefix('cab'),
    `${SRC}:76 return null // No such prefix exists`
  ),
  row(
    "contains / findOccurrences / findAllWords for 'cab'",
    'cab',
    { contains: false, occurrences: 0, words: [] },
    {
      contains: t.contains('cab'),
      occurrences: t.findOccurrences('cab'),
      words: t.findAllWords('cab')
    },
    `${SRC}:126,135,142 null node -> empty result`
  ),
  row(
    "prefix 'ca' vs complete word 'car'",
    ['ca', 'car'],
    { ca: [false, 0], car: [true, 1] },
    {
      ca: [t.contains('ca'), t.findOccurrences('ca')],
      car: [t.contains('car'), t.findOccurrences('car')]
    },
    `${SRC}:135 node.count !== 0`
  ),
  row(
    'trie unchanged after failed lookups',
    'findAllWords("") after the failed lookups',
    [
      { word: 'car', count: 1 },
      { word: 'cat', count: 1 },
      { word: 'dog', count: 1 }
    ],
    t.findAllWords(''),
    `${SRC}:69-80 findPrefix only reads children`
  )
]

t.insert('cab')
rows.push(
  row(
    "successful call after the failure: insert('cab')",
    'cab',
    { contains: true, occurrences: 1 },
    { contains: t.contains('cab'), occurrences: t.findOccurrences('cab') },
    `${SRC}:51-66 insert creates missing nodes`
  )
)

const r = build()
r.insert('car')
rows.push(
  row(
    "repeated insertion of 'car'",
    ['car', 'car'],
    2,
    r.findOccurrences('car'),
    `${SRC}:66 node.count += 1`
  )
)

// Branch reach: an in-memory copy of the real source records which `return`
// in findPrefix fired and at which character index (the file on disk is not
// changed). Line 70 is the non-string guard, line 76 the missing-child branch.
const source = readFileSync(
  new URL('../../Data-Structures/Tree/Trie.js', import.meta.url),
  'utf8'
)
const guard = "    if (typeof word !== 'string') return null\n"
const missing =
  '      if (node.children[word.charAt(i)] === undefined) return null // No such prefix exists\n'
if (!source.includes(guard) || !source.includes(missing)) {
  throw new Error('findPrefix branches not found in source')
}
const probe =
  'export const hits = []\n' +
  source
    .replace(
      guard,
      "    if (typeof word !== 'string') { hits.push({ line: 70, word }); return null }\n"
    )
    .replace(
      missing,
      '      if (node.children[word.charAt(i)] === undefined) { hits.push({ line: 76, word, i }); return null }\n'
    )
const traced = await import('data:text/javascript,' + encodeURIComponent(probe))
const tt = new traced.Trie()
tt.insert('car')
tt.insert('cat')
tt.insert('dog')
tt.findPrefix('ca') // reaches neither branch: returns the prefix node
tt.contains('cab')
tt.findPrefix(5)
rows.push(
  row(
    'branch reach (instrumented copy): which return null fired',
    ["findPrefix('ca')", "contains('cab')", 'findPrefix(5)'],
    [
      { line: 76, word: 'cab', i: 2 },
      { line: 70, word: 5 }
    ],
    traced.hits,
    `${SRC}:76 missing child at index 2 ('b'); ${SRC}:70 non-string guard`
  )
)

console.log(JSON.stringify(rows))
