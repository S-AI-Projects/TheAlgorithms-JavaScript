// Evaluates the R50-T003 fixture against the real source and prints JSON rows.
// The oracle never calls getParentPosition: it uses a hand-written table and
// the 1-based bit-shift rule parent(k) = k >> 1.
import {
  KeyPriorityQueue,
  getParentPosition
} from '../../Data-Structures/Heap/KeyPriorityQueue.js'

const SRC = 'KeyPriorityQueue.js'
const table = [
  -1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11
]
const rows = table.map((expected, position) => {
  const actual = getParentPosition(position)
  return {
    name: `getParentPosition(${position}) vs explicit table`,
    input: position,
    expected,
    actual,
    pass: actual === expected,
    precondition: `${SRC}:15-16 children 2p+1, 2p+2; parent floor((p-1)/2)`
  }
})

const shiftOracle = (p) => ((p + 1) >> 1) - 1
const range = Array.from({ length: 64 }, (_, p) => p)
const actualRange = range.map(getParentPosition)
const expectedRange = range.map(shiftOracle)
rows.push({
  name: 'getParentPosition(0..63) vs bit-shift oracle',
  input: '0..63',
  expected: expectedRange,
  actual: actualRange,
  pass: JSON.stringify(actualRange) === JSON.stringify(expectedRange),
  precondition: `${SRC}:36 getParentPosition`
})

// Fixture: FIFO via increasing priorities. One row per operation, compared
// with explicit expected values and with a plain-array FIFO reference.
const queue = new KeyPriorityQueue()
const reference = []
const steps = [
  ['push', 'A', 1, null, 1],
  ['push', 'B', 2, null, 2],
  ['push', 'C', 3, null, 3],
  ['pop', null, null, 'A', 2],
  ['pop', null, null, 'B', 1],
  ['push', 'D', 4, null, 2],
  ['pop', null, null, 'C', 1],
  ['pop', null, null, 'D', 0]
]
steps.forEach(([op, key, priority, expectedRemoved, expectedSize], i) => {
  let removed = null
  let referenceRemoved = null
  if (op === 'push') {
    queue.push(key, priority)
    reference.push(key)
  } else {
    removed = queue.pop()
    referenceRemoved = reference.shift()
  }
  const actual = {
    removed,
    size: queue.priorities.size,
    referenceRemoved,
    referenceSize: reference.length
  }
  const expected = {
    removed: expectedRemoved,
    size: expectedSize,
    referenceRemoved: expectedRemoved,
    referenceSize: expectedSize
  }
  rows.push({
    name: `fixture step ${i + 1}: ${
      op === 'push' ? `push ${key}(${priority})` : 'pop'
    }`,
    input: op === 'push' ? [op, key, priority] : [op],
    expected,
    actual,
    pass: JSON.stringify(actual) === JSON.stringify(expected),
    precondition:
      op === 'push'
        ? `${SRC}:59-63 push adds and shifts up`
        : `${SRC}:69-75 pop removes the least priority`
  })
})
rows.push({
  name: 'empty state after drain',
  input: 'isEmpty()',
  expected: true,
  actual: queue.isEmpty(),
  pass: queue.isEmpty() === true,
  precondition: `${SRC}:50-51 isEmpty`
})

const a = new KeyPriorityQueue()
const b = new KeyPriorityQueue()
a.push('A', 1)
rows.push({
  name: 'separate instances do not share contents',
  input: "a.push('A', 1); b untouched",
  expected: { aEmpty: false, bEmpty: true },
  actual: { aEmpty: a.isEmpty(), bEmpty: b.isEmpty() },
  pass: a.isEmpty() === false && b.isEmpty() === true,
  precondition: `${SRC}:41-44 constructor creates a new heap and Map`
})

console.log(JSON.stringify(rows))
