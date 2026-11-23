import { newGeneration } from '../ConwaysGameOfLife'

describe('newGeneration', () => {
  it('should produce the next generation according to the rules', () => {
    expect(
      newGeneration([
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
      ])
    ).toEqual([
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ])
  })
})

// Repeatability and input-isolation regressions for newGeneration
// (ConwaysGameOfLife.js line 24). The function has no external dependency
// (no time, randomness, I/O or module state), so the checks are: identical
// output for identical input, no mutation of the input, and no leakage
// between calls. Expected grids were worked out by hand from rules 1-3
// (lines 4-6) before running the code.
describe('newGeneration is deterministic and isolates its input', () => {
  // Fresh copies for every use, so no test can affect another.
  const glider = () => [
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]
  // Live (1,0): 3 neighbours, born. (1,2): 3, survives. (2,1): 3, survives.
  // (2,2): 2, survives. (3,1): 3, born. (0,1) and (2,0): 1 each, die.
  const gliderNext = [
    [0, 0, 0, 0, 0],
    [1, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]

  it('smallest valid input: an empty grid gives an empty grid', () => {
    expect(newGeneration([])).toEqual([])
  })

  it('smallest non-empty grid: a lone live cell dies', () => {
    // Rule 3 (line 6): a live cell with 0 neighbours dies.
    expect(newGeneration([[1]])).toEqual([[0]])
  })

  it('ordinary input: one glider step', () => {
    expect(newGeneration(glider())).toEqual(gliderNext)
  })

  it('does not modify the input grid', () => {
    const input = glider()
    newGeneration(input)
    expect(input).toEqual(glider())
  })

  it('accepts a deeply frozen grid, so it never writes to its input', () => {
    // ES modules run in strict mode: writing to a frozen array would throw.
    const frozen = Object.freeze(glider().map((row) => Object.freeze(row)))
    expect(newGeneration(frozen)).toEqual(gliderNext)
  })

  it('returns a new grid that shares no rows with the input', () => {
    const input = glider()
    const output = newGeneration(input)
    expect(output).not.toBe(input)
    output.forEach((row, i) => expect(row).not.toBe(input[i]))
  })

  it('same input twice in fresh state gives the same result', () => {
    expect(newGeneration(glider())).toEqual(gliderNext)
    expect(newGeneration(glider())).toEqual(gliderNext)
  })

  it('an earlier call with another input cannot change a later result', () => {
    const first = newGeneration(glider())
    const other = newGeneration([
      [1, 1],
      [1, 1]
    ])
    expect(other).toEqual([
      [1, 1],
      [1, 1]
    ]) // block still life: every cell has 3 neighbours
    other[0][0] = 0 // tamper with an earlier result
    const later = newGeneration(glider())
    expect(later).toEqual(gliderNext)
    expect(later).toEqual(first)
  })
})
