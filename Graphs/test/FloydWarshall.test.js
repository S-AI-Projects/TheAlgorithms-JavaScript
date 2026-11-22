import { FloydWarshall } from '../FloydWarshall'

describe('FloydWarshall', () => {
  describe('Failure and Empty-Result Paths', () => {
    test('handles empty input graph as valid empty-result path (Line 24, 25 -> Line 35)', () => {
      // Precondition: dist.length === 0 at Line 24, loop at Line 25 bypassed
      const emptyInput = []
      const result = FloydWarshall(emptyInput)
      expect(result).toEqual([])
    })

    test('preserves absent-path sentinel Infinity for disconnected components (Line 28 condition false)', () => {
      // Disconnected 2-vertex graph: no edge between 0 and 1
      const disconnectedGraph = [
        [0, Infinity],
        [Infinity, 0]
      ]
      const result = FloydWarshall(disconnectedGraph)
      expect(result).toEqual([
        [0, Infinity],
        [Infinity, 0]
      ])
    })

    test('caller-owned state remains valid and ordinary call succeeds immediately after empty/failure call', () => {
      // 1. Call empty-result path
      const emptyCall = FloydWarshall([])
      expect(emptyCall).toEqual([])

      // 2. Subsequent ordinary call succeeds without corruption
      const ordinaryInput = [
        [0, 1, 2, Infinity],
        [1, 0, Infinity, Infinity],
        [2, Infinity, 0, 1],
        [Infinity, Infinity, 1, 0]
      ]
      const expectedOrdinary = [
        [0, 1, 2, 3],
        [1, 0, 3, 4],
        [2, 3, 0, 1],
        [3, 4, 1, 0]
      ]
      const result = FloydWarshall(ordinaryInput)
      expect(result).toEqual(expectedOrdinary)
    })
  })

  describe('Smallest Valid and Ordinary Inputs', () => {
    test('smallest valid input: single vertex graph (Line 24: n=1)', () => {
      const smallestInput = [[0]]
      const expectedSmallest = [[0]]
      const result = FloydWarshall(smallestInput)
      expect(result).toEqual(expectedSmallest)
    })

    test('ordinary input: 4-vertex connected graph with indirect paths', () => {
      const ordinaryInput = [
        [0, 1, 2, Infinity],
        [1, 0, Infinity, Infinity],
        [2, Infinity, 0, 1],
        [Infinity, Infinity, 1, 0]
      ]
      const expectedOrdinary = [
        [0, 1, 2, 3],
        [1, 0, 3, 4],
        [2, 3, 0, 1],
        [3, 4, 1, 0]
      ]
      const result = FloydWarshall(ordinaryInput)
      expect(result).toEqual(expectedOrdinary)
    })

    test('ordinary directed graph with weighted edges', () => {
      const directedGraph = [
        [0, 3, 8, Infinity, -4],
        [Infinity, 0, Infinity, 1, 7],
        [Infinity, 4, 0, Infinity, Infinity],
        [2, Infinity, -5, 0, Infinity],
        [Infinity, Infinity, Infinity, 6, 0]
      ]
      const expected = [
        [0, 1, -3, 2, -4],
        [3, 0, -4, 1, -1],
        [7, 4, 0, 5, 3],
        [2, -1, -5, 0, -2],
        [8, 5, 1, 6, 0]
      ]
      const result = FloydWarshall(directedGraph)
      expect(result).toEqual(expected)
    })
  })
})
