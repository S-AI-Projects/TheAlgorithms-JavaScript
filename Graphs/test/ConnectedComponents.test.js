import { describe, it, expect } from 'vitest'
import { GraphUnweightedUndirectedAdjacencyList } from '../ConnectedComponents.js'

describe('GraphUnweightedUndirectedAdjacencyList', () => {
  it('returns empty array [] for smallest valid input (empty graph, line 47 -> line 52) and preserves valid state for subsequent calls', () => {
    const graph = new GraphUnweightedUndirectedAdjacencyList()

    const emptyResult = graph.connectedComponents()
    expect(emptyResult).toEqual([])
    expect(graph.connections).toEqual({})

    graph.addEdge(1, 2)
    graph.addEdge(3, 4)
    graph.addEdge(3, 5)

    expect(graph.connectedComponents()).toEqual(['1', '3'])
  })

  it('throws TypeError when DFSComponent is called with a nonexistent node (line 34) without corrupting graph state', () => {
    const graph = new GraphUnweightedUndirectedAdjacencyList()
    graph.addNode(10)

    const visited = new Set()
    const components = []

    expect(() => graph.DFSComponent(components, '999', visited)).toThrow(TypeError)

    expect(Object.keys(graph.connections)).toEqual(['10'])
    graph.addEdge(10, 20)
    expect(graph.connectedComponents()).toEqual(['10'])
  })
})
