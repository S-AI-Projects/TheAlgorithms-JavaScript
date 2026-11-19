import { powLogarithmic } from '../PowLogarithmic'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

describe('PowLogarithmic', () => {
  it('should return 1 for numbers with exponent 0', () => {
    expect(powLogarithmic(2, 0)).toBe(1)
  })

  it('should return 0 for numbers with base 0', () => {
    expect(powLogarithmic(0, 23)).toBe(0)
  })

  it('should return the base to the exponent power', () => {
    expect(powLogarithmic(24, 4)).toBe(331776)
  })
})

it('executes and verifies the example written in the JSDoc', () => {
  const source = readFileSync(
    fileURLToPath(new URL('../PowLogarithmic.js', import.meta.url)),
    'utf8'
  )
  const example = source.match(
    /^\s*\* powLogarithmic\((\d+),\s*(\d+)\) \/\/ => (\d+)$/m
  )

  expect(example).not.toBeNull()
  const [, base, exponent, expected] = example
  expect(powLogarithmic(Number(base), Number(exponent))).toBe(Number(expected))
})
