import { KeyPriorityQueue, getParentPosition } from '../KeyPriorityQueue.js'

describe('Key Priority Queue', () => {
  describe('Method isEmpty', () => {
    test('Check heap is empty', () => {
      const queue = new KeyPriorityQueue()
      const res = queue.isEmpty()
      expect(res).toEqual(true)
    })

    test('Check heap is not empty', () => {
      const queue = new KeyPriorityQueue()
      queue.push(0, 2)
      const res = queue.isEmpty()
      expect(res).toEqual(false)
    })
  })

  describe('Methods push and pop', () => {
    test('Test Case 1', () => {
      // create queue
      const queue = new KeyPriorityQueue()
      queue.push(0, 3)
      queue.push(1, 7)
      queue.push(2, 9)
      queue.push(3, 13)
      // create expected queue
      const expectedQueue = new KeyPriorityQueue()
      expectedQueue.push(1, 7)
      expectedQueue.push(3, 13)
      expectedQueue.push(2, 9)
      // result from popping element from the queue
      queue.pop()
      expect(queue).toEqual(expectedQueue)
    })

    test('Test Case 2', () => {
      // create queue
      const queue = new KeyPriorityQueue()
      queue.push(0, 3)
      queue.push(1, 9)
      queue.push(2, 7)
      queue.push(3, 13)
      // create expected queue
      const expectedQueue = new KeyPriorityQueue()
      expectedQueue.push(2, 7)
      expectedQueue.push(1, 9)
      expectedQueue.push(3, 13)
      // result from popping element from the queue
      queue.pop()
      expect(queue).toEqual(expectedQueue)
    })

    test('Test Case 3', () => {
      // create queue
      const queue = new KeyPriorityQueue()
      queue.push(0, 3)
      queue.push(1, 7)
      queue.push(2, 9)
      queue.push(3, 12)
      queue.push(4, 13)
      // create expected queue
      const expectedQueue = new KeyPriorityQueue()
      expectedQueue.push(1, 7)
      expectedQueue.push(3, 12)
      expectedQueue.push(2, 9)
      expectedQueue.push(4, 13)
      // result from popping element from the queue
      queue.pop()
      expect(queue).toEqual(expectedQueue)
    })
  })

  describe('Method contains', () => {
    test('Check heap does not contain element', () => {
      const queue = new KeyPriorityQueue()
      const res = queue.contains(0)
      expect(res).toEqual(false)
    })

    test('Check heap contains element', () => {
      const queue = new KeyPriorityQueue()
      queue.push(0, 2)
      const res = queue.contains(0)
      expect(res).toEqual(true)
    })
  })

  describe('Method update', () => {
    test('Update without change in position', () => {
      // create queue
      const queue = new KeyPriorityQueue()
      queue.push(0, 3)
      queue.push(1, 5)
      queue.push(2, 7)
      queue.push(3, 11)
      // create expected queue
      const expectedQueue = new KeyPriorityQueue()
      expectedQueue.push(0, 2)
      expectedQueue.push(1, 5)
      expectedQueue.push(2, 7)
      expectedQueue.push(3, 11)
      // result from updating to similar priority
      queue.update(0, 2)
      expect(queue).toEqual(expectedQueue)
    })

    test('Update with change in position', () => {
      // create queue
      const queue = new KeyPriorityQueue()
      queue.push(0, 3)
      queue.push(1, 5)
      queue.push(2, 7)
      queue.push(3, 11)
      // create expected queue
      const expectedQueue = new KeyPriorityQueue()
      expectedQueue.push(1, 5)
      expectedQueue.push(3, 11)
      expectedQueue.push(2, 7)
      expectedQueue.push(0, 9)
      // result from updating to similar priority
      queue.update(0, 9)
      expect(queue).toEqual(expectedQueue)
    })
  })
})

// Reference comparison for getParentPosition (KeyPriorityQueue.js line 36).
describe('getParentPosition against independent references', () => {
  // Reviewed explicit table, written by hand from the heap layout described
  // at lines 12-16: children of p are 2p + 1 and 2p + 2, so positions
  // (1, 2) -> 0, (3, 4) -> 1, (5, 6) -> 2, ... and the root has no parent (-1).
  const expectedParents = [
    -1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11,
    11
  ]

  test.each(expectedParents.map((parent, position) => [position, parent]))(
    'explicit table: parent of position %i is %i',
    (position, parent) => {
      expect(getParentPosition(position)).toBe(parent)
    }
  )

  // Different method: in 1-based heap numbering the parent of k is k >> 1,
  // so the 0-based parent of p is ((p + 1) >> 1) - 1. No division or floor.
  test('bit-shift oracle agrees for positions 0..63', () => {
    const oracle = (p) => ((p + 1) >> 1) - 1
    const mismatches = []
    for (let p = 0; p < 64; p++) {
      if (getParentPosition(p) !== oracle(p)) {
        mismatches.push([p, getParentPosition(p), oracle(p)])
      }
    }
    expect(mismatches).toEqual([])
  })

  test('representative result: getParentPosition(4) is 1', () => {
    expect(getParentPosition(4)).toBe(1)
    expect(getParentPosition(3)).toBe(getParentPosition(4))
  })
})

describe('queue order relying on getParentPosition', () => {
  // Increasing priorities make the min-heap behave first-in, first-out.
  // Each step lists the explicit expected removed key and queue size; a
  // plain array (independent FIFO reference) must agree after every step.
  test('enqueue A, B, C; remove twice; insert D; drain -> A, B, C, D', () => {
    const steps = [
      { op: 'push', key: 'A', priority: 1, size: 1 },
      { op: 'push', key: 'B', priority: 2, size: 2 },
      { op: 'push', key: 'C', priority: 3, size: 3 },
      { op: 'pop', removed: 'A', size: 2 },
      { op: 'pop', removed: 'B', size: 1 },
      { op: 'push', key: 'D', priority: 4, size: 2 },
      { op: 'pop', removed: 'C', size: 1 },
      { op: 'pop', removed: 'D', size: 0 }
    ]
    const queue = new KeyPriorityQueue()
    const reference = []
    expect(queue.isEmpty()).toBe(true)

    const removed = []
    for (const step of steps) {
      if (step.op === 'push') {
        queue.push(step.key, step.priority)
        reference.push(step.key)
      } else {
        const key = queue.pop()
        expect(key).toBe(step.removed)
        expect(key).toBe(reference.shift())
        removed.push(key)
      }
      expect(queue.priorities.size).toBe(step.size)
      expect(reference.length).toBe(step.size)
      expect(queue.isEmpty()).toBe(step.size === 0)
    }

    expect(removed).toEqual(['A', 'B', 'C', 'D'])
    expect(queue.contains('A')).toBe(false)
  })

  test('separate instances do not share contents', () => {
    const first = new KeyPriorityQueue()
    const second = new KeyPriorityQueue()
    first.push('A', 1)
    expect(first.isEmpty()).toBe(false)
    expect(second.isEmpty()).toBe(true)
    expect(second.contains('A')).toBe(false)

    second.push('B', 1)
    expect(first.pop()).toBe('A')
    expect(first.isEmpty()).toBe(true)
    expect(second.contains('B')).toBe(true)
    expect(second.priorities.size).toBe(1)
  })
})
