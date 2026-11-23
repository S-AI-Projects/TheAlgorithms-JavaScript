// Evaluates the R50-T001 fixture against the real setBit and prints JSON rows.
// Expected values were calculated by hand in binary before running the source.
import { setBit } from '../../Bit-Manipulation/SetBit.js'

const cases = [
  {
    name: 'smallest valid input',
    input: [0, 0],
    expected: 1,
    precondition: 'SetBit.js:36 bitPosition is zero based (0 is smallest)'
  },
  {
    name: 'ordinary input (0b101 -> 0b111)',
    input: [5, 1],
    expected: 7,
    precondition: 'SetBit.js:36 bitPosition is zero based'
  },
  {
    name: 'repeated value: bit already set',
    input: [7, 1],
    expected: 7,
    precondition: 'SetBit.js:13 1 | 1 -> 1'
  },
  {
    name: 'boundary: highest positive bit',
    input: [0, 30],
    expected: 1073741824,
    precondition: 'SetBit.js:6-7 operands are 32-bit integers'
  },
  {
    name: 'boundary: sign bit',
    input: [0, 31],
    expected: -2147483648,
    precondition: 'SetBit.js:6-7 operands are 32-bit integers'
  }
]

const rows = cases.map((c) => {
  const actual = setBit(...c.input)
  return { ...c, actual, pass: Object.is(actual, c.expected) }
})

// Mutation check: arguments are primitives and must be unchanged.
const number = 5
const bitPosition = 1
setBit(number, bitPosition)
rows.push({
  name: 'arguments unchanged after call',
  input: [5, 1],
  expected: [5, 1],
  actual: [number, bitPosition],
  pass: number === 5 && bitPosition === 1,
  precondition: 'SetBit.js:42-44 returns a new value only'
})

console.log(JSON.stringify(rows))
