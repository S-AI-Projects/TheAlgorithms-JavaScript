// R50-T006 evidence: the fixture against the refactored countLetters, and a
// before/after comparison against an unmodified copy of the original
// (CountLetters.before.js, copied from the pinned commit before editing).
import { countLetters } from '../../String/CountLetters.js'
import { countLetters as countLettersBefore } from './CountLetters.before.js'

const SRC = 'CountLetters.js'
const call = (fn, x) => {
  try {
    const result = fn(x)
    return { result, keys: Object.keys(result) }
  } catch (e) {
    return { error: `${e.constructor.name}: ${e.message}` }
  }
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const fixture = [
  [
    'smallest valid input',
    '',
    { result: {}, keys: [] },
    `${SRC}:12,16,20 '' passes all guards`
  ],
  [
    'ordinary input',
    'Mississippi',
    { result: { m: 1, i: 4, s: 4, p: 2 }, keys: ['m', 'i', 's', 'p'] },
    `${SRC}:16,20 letters only`
  ],
  [
    'mixed case',
    'HelLo',
    { result: { h: 1, e: 1, l: 2, o: 1 }, keys: ['h', 'e', 'l', 'o'] },
    `${SRC}:27 counting is case-insensitive`
  ],
  [
    'non-string',
    0,
    { error: 'TypeError: Input should be a string' },
    `${SRC}:12-13`
  ],
  [
    'special character',
    'two words',
    { error: 'TypeError: Input must not contain special characters' },
    `${SRC}:16-17`
  ],
  [
    'digit',
    'h3llo',
    { error: 'TypeError: Input must not contain numbers' },
    `${SRC}:20-21`
  ]
]

const rows = fixture.map(([name, input, expected, precondition]) => {
  const actual = call(countLetters, input)
  return {
    name,
    input,
    expected,
    actual,
    pass: same(actual, expected),
    precondition
  }
})

// Before/after agreement on the fixture plus 300 deterministic inputs.
let seed = 6
const random = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648
  return seed / 2147483648
}
const alphabet = 'abcXYZ_eE 1!'
const inputs = fixture.map((f) => f[1])
for (let n = 0; n < 300; n++) {
  let s = ''
  const length = Math.floor(random() * 10)
  for (let k = 0; k < length; k++)
    s += alphabet[Math.floor(random() * alphabet.length)]
  inputs.push(s)
}
const disagreements = inputs.filter(
  (x) => !same(call(countLetters, x), call(countLettersBefore, x))
)
rows.push({
  name: 'before/after agree (results, key order, errors)',
  input: `${inputs.length} inputs (fixture + 300 generated)`,
  expected: [],
  actual: disagreements,
  pass: disagreements.length === 0,
  precondition: `${SRC}:9 public signature unchanged`
})

console.log(JSON.stringify(rows))
