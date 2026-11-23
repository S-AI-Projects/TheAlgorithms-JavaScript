// Evaluates the R50-T002 boundary fixture against the real source and prints
// JSON rows. Expected values were written down before running the source.
import {
  encrypt,
  checkKeywordValidity
} from '../../Ciphers/KeywordShiftedAlphabet.js'

const SRC = 'KeywordShiftedAlphabet.js'
const rule = `${SRC}:3 each character can occur only once`

const run = (fn) => {
  try {
    return fn()
  } catch (e) {
    return `throws: ${e.message}`
  }
}

const cases = [
  ['valid boundary: smallest keyword', 'a', true, rule],
  ['valid interior: ordinary keyword', 'keyword', true, rule],
  ['valid boundary: all 26 letters', 'zyxwvutsrqponmlkjihgfedcba', true, rule],
  ['invalid boundary: smallest repeat', 'aa', false, rule],
  ['invalid interior: ordinary repeat', 'hello', false, rule],
  ['invalid: 27 letters', 'zyxwvutsrqponmlkjihgfedcbaa', false, rule]
]

const rows = cases.map(([name, keyword, expected, precondition]) => {
  const actual = run(() => checkKeywordValidity(keyword))
  return {
    name: `checkKeywordValidity ${name}`,
    input: keyword,
    expected,
    actual,
    pass: actual === expected,
    precondition
  }
})

const encryptCases = [
  ['encrypt with smallest keyword', ['a', 'abc'], 'abc', rule],
  [
    'encrypt with ordinary keyword',
    ['keyword', 'Hello world!'],
    'Aoggj ujngw!',
    `${SRC}:8 translation table`
  ],
  [
    'encrypt rejects repeated keyword',
    ['aa', 'abc'],
    'throws: Invalid keyword!',
    `${SRC}:103-104 checkInputs -> Invalid keyword!`
  ],
  [
    'encrypt rejects empty keyword',
    ['', 'abc'],
    'throws: Both keyword and message must be specified',
    `${SRC}:99-100 checkInputs`
  ]
]

for (const [name, input, expected, precondition] of encryptCases) {
  const actual = run(() => encrypt(...input))
  rows.push({
    name,
    input,
    expected,
    actual,
    pass: actual === expected,
    precondition
  })
}

console.log(JSON.stringify(rows))
