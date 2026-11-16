import * as coordinate from '../Coordinate'

describe('Testing euclideanDistance calculations', () => {
  // Preconditions established in Maths/Coordinate.js:
  // Line 16: euclideanDistance calculates Euclidean distance between 2 points in 2D Cartesian plane.
  // Lines 17-18: computes coordinate deltas dx = longitude2 - longitude1 and dy = latitude2 - latitude1.
  // Line 19: returns Euclidean norm Math.hypot(dx, dy) (or Math.sqrt(dx * dx + dy * dy)).

  it('Should give a numeric output (distance between 2 points) with 4 numeric arguments', () => {
    // Precondition: Maths/Coordinate.js lines 16-19
    const euclideanDistance = coordinate.euclideanDistance(2, 2, -10, -7)
    expect(euclideanDistance).toBe(15)
  })

  it('Should not give any output given non-numeric argument', () => {
    // Precondition: Maths/Coordinate.js lines 17-19 (arithmetic with NaN produces NaN)
    const euclideanDistance = coordinate.euclideanDistance(
      'ABC',
      '123',
      '',
      '###'
    )
    expect(euclideanDistance).toBeNaN()
  })

  it('Should not give any output given any number of numeric arguments less than 4', () => {
    // Precondition: Maths/Coordinate.js lines 16-19 (missing arguments default to undefined, resulting in NaN)
    const euclideanDistance3arg = coordinate.euclideanDistance(2, 2, -10)
    const euclideanDistance2arg = coordinate.euclideanDistance(2, 2)
    const euclideanDistance1arg = coordinate.euclideanDistance(2)
    const euclideanDistance0arg = coordinate.euclideanDistance()
    expect(euclideanDistance3arg).toBeNaN()
    expect(euclideanDistance2arg).toBeNaN()
    expect(euclideanDistance1arg).toBeNaN()
    expect(euclideanDistance0arg).toBeNaN()
  })

  describe('Fixtures and Invariant Checks', () => {
    // Smallest valid input: points at the origin (0, 0, 0, 0)
    it('handles smallest valid input (0, 0, 0, 0) with explicit expected output 0', () => {
      // Precondition: Maths/Coordinate.js lines 17-19 (dx = 0 - 0 = 0, dy = 0 - 0 = 0, sqrt(0) = 0)
      const input = [0, 0, 0, 0]
      const expected = 0 // independently calculated: sqrt((0-0)^2 + (0-0)^2) = 0
      const actual = coordinate.euclideanDistance(...input)
      expect(actual).toBe(expected)
      expect(typeof actual).toBe('number')
      expect(Number.isFinite(actual)).toBe(true)
    })

    // Representative ordinary input: (2, 2, 14, 11) from header documentation example
    it('handles representative ordinary input (2, 2, 14, 11) with independently calculated expected output 15', () => {
      // Precondition: Maths/Coordinate.js lines 17-19 (dx = 14 - 2 = 12, dy = 11 - 2 = 9, sqrt(144 + 81) = 15)
      const input = [2, 2, 14, 11]
      const expected = 15 // independently calculated: sqrt(12^2 + 9^2) = sqrt(225) = 15
      const actual = coordinate.euclideanDistance(...input)
      expect(actual).toBe(expected)
      expect(typeof actual).toBe('number')
      expect(Number.isFinite(actual)).toBe(true)
    })

    it('preserves purity, determinism, and input non-mutation across repeated and interleaved runs', () => {
      // Precondition: Maths/Coordinate.js lines 16-19
      const expected = 15
      const input = [2, 2, 14, 11]

      // Run 1: First invocation
      const actual1 = coordinate.euclideanDistance(2, 2, 14, 11)
      expect(actual1).toBe(expected)

      // Interleaved run on different valid input (3, 4, 0, 0) -> distance 5
      const interleaved = coordinate.euclideanDistance(3, 4, 0, 0)
      expect(interleaved).toBe(5)

      // Run 2: Repeated invocation after interleaved run
      const actual2 = coordinate.euclideanDistance(...input)
      expect(actual2).toBe(expected)
      expect(actual1).toBe(actual2)

      // Verify input array was not mutated
      expect(input).toEqual([2, 2, 14, 11])
    })
  })
})

describe('Testing manhattanDistance calculations', () => {
  it('Should give a numeric output (distance between 2 points) with 4 numeric arguments', () => {
    const manhattanDistance = coordinate.manhattanDistance(2, 2, -10, -7)
    expect(manhattanDistance).toBe(21)
  })
  it('Should not give any output given non-numeric argument', () => {
    const manhattanDistance = coordinate.manhattanDistance(
      'ABC',
      '123',
      '',
      '###'
    )
    expect(manhattanDistance).toBeNaN()
  })
  it('Should not give any output given any number of numeric arguments less than 4', () => {
    const manhattanDistance3arg = coordinate.manhattanDistance(2, 2, -10)
    const manhattanDistance2arg = coordinate.manhattanDistance(2, 2)
    const manhattanDistance1arg = coordinate.manhattanDistance(2)
    const manhattanDistance0arg = coordinate.manhattanDistance()
    expect(manhattanDistance3arg).toBeNaN()
    expect(manhattanDistance2arg).toBeNaN()
    expect(manhattanDistance1arg).toBeNaN()
    expect(manhattanDistance0arg).toBeNaN()
  })
})
