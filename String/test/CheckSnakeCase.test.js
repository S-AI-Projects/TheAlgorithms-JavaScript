import { checkSnakeCase } from '../CheckSnakeCase'

// Independent reference oracle using string splitting instead of regex pattern matching
function referenceOracle(str) {
  return str.split('_').length > 1
}

describe('checkSnakeCase', () => {
  describe('Existing test cases', () => {
    it('expect to throw an error if input is not a string', () => {
      expect(() => checkSnakeCase(0)).toThrow(TypeError)
    })

    it('expects to return true if the input is in snake case format', () => {
      const value = 'docker_build'
      const result = checkSnakeCase(value)
      expect(result).toBe(true)
    })

    it('expects to return false if the input is not in snake case format', () => {
      const value = 'dockerBuild'
      const result = checkSnakeCase(value)
      expect(result).toBe(false)
    })
  })

  describe('Stated Fixture: Smallest valid input and ordinary input', () => {
    it('handles the smallest valid input: empty string "" (Precondition line 12: typeof varName === "string")', () => {
      const input = ''
      // Independently calculated expected output: false (no underscores)
      const expected = false
      const result = checkSnakeCase(input)

      expect(result).toBe(expected)
      expect(result).toBe(referenceOracle(input))
    })

    it('handles one ordinary input: "docker_build" (Precondition line 12: typeof varName === "string")', () => {
      const input = 'docker_build'
      // Independently calculated expected output: true (contains underscore separator)
      const expected = true
      const result = checkSnakeCase(input)

      expect(result).toBe(expected)
      expect(result).toBe(referenceOracle(input))
    })
  })

  describe('Independent Reference Comparison: 22 enumerated inputs vs Oracle', () => {
    const cases = [
      { input: '', expected: false, desc: 'empty string' },
      { input: 'a', expected: false, desc: 'single lowercase char' },
      { input: 'A', expected: false, desc: 'single uppercase char' },
      { input: 'word', expected: false, desc: 'single word' },
      { input: 'camelCase', expected: false, desc: 'camelCase identifier' },
      { input: 'PascalCase', expected: false, desc: 'PascalCase identifier' },
      { input: 'kebab-case', expected: false, desc: 'kebab-case identifier' },
      { input: 'UPPERCASE', expected: false, desc: 'all caps word' },
      { input: '12345', expected: false, desc: 'numeric string' },
      { input: '_', expected: true, desc: 'single underscore' },
      { input: '__', expected: true, desc: 'double underscore' },
      { input: 'a_b', expected: true, desc: 'short snake case' },
      { input: 'docker_build', expected: true, desc: 'standard snake case' },
      { input: 'snake_case', expected: true, desc: 'canonical snake case' },
      { input: 'first_second_third', expected: true, desc: 'multiple words' },
      { input: 'user_id', expected: true, desc: 'common identifier' },
      { input: 'val_1', expected: true, desc: 'word with digit' },
      { input: '1_2', expected: true, desc: 'digits separated by underscore' },
      { input: 'CONSTANT_CASE', expected: true, desc: 'screaming snake case' },
      { input: 'trailing_', expected: true, desc: 'trailing underscore' },
      { input: '_leading', expected: true, desc: 'leading underscore' },
      {
        input: 'multiple___underscores',
        expected: true,
        desc: 'consecutive underscores'
      }
    ]

    for (const { input, expected, desc } of cases) {
      it(`matches oracle and expected table for ${desc} (${JSON.stringify(
        input
      )})`, () => {
        const actual = checkSnakeCase(input)
        const oracle = referenceOracle(input)

        expect(actual).toBe(expected)
        expect(actual).toBe(oracle)
      })
    }
  })

  describe('Precondition boundaries: Non-string inputs (Line 12-14)', () => {
    it.each([
      [0, 'number 0'],
      [123, 'positive number'],
      [-42, 'negative number'],
      [null, 'null'],
      [undefined, 'undefined'],
      [true, 'boolean true'],
      [false, 'boolean false'],
      [{}, 'plain object'],
      [[], 'empty array'],
      [['str'], 'array with string'],
      [() => {}, 'function']
    ])('throws TypeError("Argument is not a string.") for %s (%s)', (val) => {
      expect(() => checkSnakeCase(val)).toThrow(TypeError)
      expect(() => checkSnakeCase(val)).toThrow('Argument is not a string.')
    })
  })
})
