import ouncesToKilograms from '../OuncesToKilograms'

describe('Tests for ouncesToKilograms', () => {
  // Preconditions established in Conversions/OuncesToKilograms.js:
  // Line 15: const ouncesToKilograms = (oz) =>
  // Line 16: return (oz * 28.3498) / 1000

  test('Convert 60 ounces to kilograms', () => {
    // Precondition: Conversions/OuncesToKilograms.js line 16
    expect(parseFloat(ouncesToKilograms(60).toFixed(3))).toBe(1.701)
  })

  describe('Fixtures and Failure-Path Behavior', () => {
    // Smallest valid input: 0 ounces
    test('handles smallest valid input (0 ounces) with explicit expected output 0', () => {
      // Precondition: Conversions/OuncesToKilograms.js line 16: (0 * 28.3498) / 1000 = 0
      const input = 0
      const expected = 0 // independently calculated
      const actual = ouncesToKilograms(input)
      expect(actual).toBe(expected)
      expect(typeof actual).toBe('number')
      expect(Number.isFinite(actual)).toBe(true)
    })

    // Representative ordinary input: 60 ounces
    test('handles representative ordinary input (60 ounces) with independently calculated value', () => {
      // Precondition: Conversions/OuncesToKilograms.js line 16: (60 * 28.3498) / 1000 = 1.700988
      const input = 60
      const expected = 1.700988 // independently calculated: 60 * 0.0283498 = 1.700988
      const actual = ouncesToKilograms(input)
      expect(actual).toBeCloseTo(expected, 6)
      expect(parseFloat(actual.toFixed(3))).toBe(1.701)
    })

    // Documented failure or absent-result branch: non-numeric or missing inputs evaluate to NaN
    test('evaluates failure / absent-result branch with sentinel NaN for non-numeric or missing input', () => {
      // Precondition: Conversions/OuncesToKilograms.js line 16: arithmetic with NaN or undefined returns NaN
      const failureInput = NaN
      const actualFailure = ouncesToKilograms(failureInput)
      expect(actualFailure).toBeNaN()

      // Also verify missing argument
      expect(ouncesToKilograms()).toBeNaN()
      expect(ouncesToKilograms('abc')).toBeNaN()
    })

    // Verify caller-owned state remains valid and ordinary valid call succeeds after failure
    test('preserves caller-owned state across failure and succeeds on subsequent valid calls', () => {
      // Precondition: Conversions/OuncesToKilograms.js lines 15-16
      const callerState = { input: [60], label: 'test-conversion' }
      const frozenStateSnapshot = JSON.stringify(callerState)

      // 1. Invoke failure path
      const failResult = ouncesToKilograms(NaN)
      expect(failResult).toBeNaN()

      // 2. Assert caller-owned state was not mutated by the failure call
      expect(JSON.stringify(callerState)).toBe(frozenStateSnapshot)

      // 3. Immediately invoke ordinary valid call after failure
      const subsequentValidResult = ouncesToKilograms(callerState.input[0])
      expect(subsequentValidResult).toBeCloseTo(1.700988, 6)
      expect(parseFloat(subsequentValidResult.toFixed(3))).toBe(1.701)

      // Assert caller state remains intact after valid run
      expect(JSON.stringify(callerState)).toBe(frozenStateSnapshot)
    })
  })
})
