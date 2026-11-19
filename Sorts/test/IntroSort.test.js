import { introsort } from '../IntroSort.js'

describe('introsort public behavior', () => {
  it.each([
    [
      [3, 1, 2],
      [1, 2, 3]
    ],
    [
      [2, 2, 1],
      [1, 2, 2]
    ],
    [
      [1, 2, 3],
      [1, 2, 3]
    ],
    [
      [3, 2, 1],
      [1, 2, 3]
    ],
    [[7], [7]],
    [[], []]
  ])('sorts %j into %j', (input, expected) => {
    const values = [...input]
    introsort(values, (a, b) => a - b)
    expect(values).toEqual(expected)
  })

  it('retains the default lexicographic comparison behavior', () => {
    const values = ['b', 'a', 'c']
    introsort(values)
    expect(values).toEqual(['a', 'b', 'c'])
  })
})
