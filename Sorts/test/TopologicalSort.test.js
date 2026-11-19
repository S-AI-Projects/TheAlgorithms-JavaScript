import { TopologicalSorter } from '../TopologicalSort.js'

describe('TopologicalSorter supported boundaries', () => {
  it('returns an empty list when no precedence edges were added', () => {
    const sorter = new TopologicalSorter()
    expect(sorter.sortAndGetOrderedItems()).toEqual([])
  })

  it('places each predecessor before its successor in a chain', () => {
    const sorter = new TopologicalSorter()
    sorter.addOrder('compile', 'test')
    sorter.addOrder('test', 'package')
    expect(sorter.sortAndGetOrderedItems()).toEqual([
      'compile',
      'test',
      'package'
    ])
  })

  it('includes the smallest supported graph: one edge and two nodes', () => {
    const sorter = new TopologicalSorter()
    sorter.addOrder('first', 'second')
    expect(sorter.sortAndGetOrderedItems()).toEqual(['first', 'second'])
  })

  it('includes a sink node even though it has no outgoing edge', () => {
    const sorter = new TopologicalSorter()
    sorter.addOrder('source', 'sink')
    expect(sorter.sortAndGetOrderedItems()).toEqual(['source', 'sink'])
  })
})
