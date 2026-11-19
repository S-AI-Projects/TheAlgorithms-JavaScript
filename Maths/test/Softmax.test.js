import { Softmax } from '../Softmax'

describe('Softmax', () => {
  it('should return equal distribution of 1 for equal input values', () => {
    expect(Softmax([1, 1])).toEqual([0.5, 0.5])
    expect(Softmax([1, 1, 1, 1])).toEqual([0.25, 0.25, 0.25, 0.25])
  })

  it('should return values which sum to the value of 1', () => {
    expect(Softmax([1, 2, 3, 4]).reduce((a, b) => a + b, 0)).toEqual(1)
  })
})

it('exposes the empty-input reduce failure and remains usable afterwards', () => {
  expect(() => Softmax([])).toThrow(TypeError)
  expect(Softmax([0])).toEqual([1])
})
