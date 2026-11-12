import { BinaryHeap, minHeapComparator } from '../BinaryHeap'

describe('BinaryHeap worked example & contract checks (Precondition near line 10 of Data-Structures/Heap/BinaryHeap.js)', () => {
  test('Smallest valid input (insert single element)', () => {
    const heap = new BinaryHeap(minHeapComparator)
    heap.insert(10)
    expect(heap.peek()).toBe(10)
    expect(heap.size()).toBe(1)
  })

  test('Ordinary input (insert multiple elements and extract top)', () => {
    const heap = new BinaryHeap(minHeapComparator)
    heap.insert(10)
    heap.insert(5)
    heap.insert(20)
    expect(heap.extractTop()).toBe(5)
    expect(heap.extractTop()).toBe(10)
    expect(heap.extractTop()).toBe(20)
  })

  test('Executable Worked Example trace asserting decisive state transitions', () => {
    const heap = new BinaryHeap(minHeapComparator)

    // 1. Initial state
    expect(heap.empty()).toBe(true)

    // 2. Insert 10 -> heap: [10]
    heap.insert(10)
    expect(heap.peek()).toBe(10)

    // 3. Insert 5 -> Bubble-up transition: 5 becomes root -> heap: [5, 10]
    heap.insert(5)
    expect(heap.peek()).toBe(5)

    // 4. Insert 20 -> heap: [5, 10, 20]
    heap.insert(20)
    expect(heap.peek()).toBe(5)
    expect(heap.size()).toBe(3)

    // 5. Extract top -> Sink-down transition: 5 extracted, 10 becomes root -> heap: [10, 20]
    const topVal = heap.extractTop()
    expect(topVal).toBe(5)
    expect(heap.peek()).toBe(10)
    expect(heap.size()).toBe(2)
  })
})
