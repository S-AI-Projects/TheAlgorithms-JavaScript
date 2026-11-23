import { setBit } from '../SetBit'

test('Set bit number 0 in 1:', () => {
  const setBitPos = setBit(1, 0)
  expect(setBitPos).toBe(1)
})

test('Set bit number 0 in 2:', () => {
  const setBitPos = setBit(2, 0)
  expect(setBitPos).toBe(3)
})

test('Set bit number 1 in 10:', () => {
  const setBitPos = setBit(10, 1)
  expect(setBitPos).toBe(10)
})

test('Set bit number 2 in 10:', () => {
  const setBitPos = setBit(10, 2)
  expect(setBitPos).toBe(14)
})

// Contract regressions for setBit (SetBit.js line 42).
// Expected values were calculated by hand in binary before running the code:
//   0b000 | (1 << 0)  = 0b001 = 1
//   0b101 | (1 << 1)  = 0b111 = 7
//   0b111 | (1 << 1)  = 0b111 = 7     (bit already set, 1 | 1 -> 1)
//   0     | (1 << 30) = 2^30  = 1073741824
//   0     | (1 << 31) = 0x80000000, read as signed 32-bit = -2147483648
describe('setBit contract', () => {
  // Precondition: bitPosition is zero based (SetBit.js line 36).
  test('smallest valid input: setBit(0, 0) sets bit 0 of zero', () => {
    expect(setBit(0, 0)).toBe(1)
  })

  // Precondition: bitPosition is zero based (SetBit.js line 36).
  test('ordinary input: setBit(5, 1) turns 0b101 into 0b111', () => {
    expect(setBit(5, 1)).toBe(7)
  })

  // Precondition: 1 | 1 -> 1 (SetBit.js line 13).
  test('repeated value: setting a bit that is already set is a no-op', () => {
    expect(setBit(7, 1)).toBe(7)
    expect(setBit(setBit(0, 3), 3)).toBe(8)
  })

  // Precondition: operands are 32-bit integers (SetBit.js lines 6-7).
  test('domain boundary: bit 30 is the highest positive bit', () => {
    expect(setBit(0, 30)).toBe(1073741824)
  })

  test('domain boundary: bit 31 is the 32-bit sign bit', () => {
    expect(setBit(0, 31)).toBe(-2147483648)
  })

  test('returns a new value and leaves its arguments unchanged', () => {
    const number = 5
    const bitPosition = 1
    const result = setBit(number, bitPosition)
    expect(result).toBe(7)
    expect(number).toBe(5)
    expect(bitPosition).toBe(1)
  })
})
