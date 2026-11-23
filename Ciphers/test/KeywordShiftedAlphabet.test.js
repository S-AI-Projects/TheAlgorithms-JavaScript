import {
  encrypt,
  decrypt,
  checkKeywordValidity
} from '../KeywordShiftedAlphabet'

test('Hello world! === decrypt(encrypt(Hello world!))', () => {
  const word = 'Hello world!'
  const result = decrypt('keyword', encrypt('keyword', word))
  expect(result).toMatch(word)
})

test('The Algorithms === decrypt(encrypt(The Algorithms))', () => {
  const word = 'The Algorithms'
  const result = decrypt('keyword', encrypt('keyword', word))
  expect(result).toMatch(word)
})

// Boundary tests for checkKeywordValidity (KeywordShiftedAlphabet.js line 65).
// Contract (line 3): "Keyword must be a word where each character can occur
// only once." Empty input is rejected earlier by checkInputs (line 99).
describe('checkKeywordValidity boundaries', () => {
  describe('valid side', () => {
    test("smallest valid keyword 'a' is accepted", () => {
      expect(checkKeywordValidity('a')).toBe(true)
      // 'a' leaves the alphabet unchanged, so encryption is the identity.
      expect(encrypt('a', 'abc')).toBe('abc')
    })

    test("ordinary keyword 'keyword' is accepted", () => {
      expect(checkKeywordValidity('keyword')).toBe(true)
      // Table at line 8: H->A, E->O, L->G, O->J, W->U, R->N, D->W
      expect(encrypt('keyword', 'Hello world!')).toBe('Aoggj ujngw!')
    })

    test('largest valid keyword uses all 26 letters exactly once', () => {
      const reversed = 'zyxwvutsrqponmlkjihgfedcba'
      expect(checkKeywordValidity(reversed)).toBe(true)
      expect(encrypt(reversed, 'abc')).toBe('zyx')
    })
  })

  describe('invalid side', () => {
    test("smallest repeated keyword 'aa' is rejected", () => {
      expect(checkKeywordValidity('aa')).toBe(false)
      expect(() => encrypt('aa', 'abc')).toThrow('Invalid keyword!')
      expect(() => decrypt('aa', 'abc')).toThrow('Invalid keyword!')
    })

    test("ordinary repeated keyword 'hello' is rejected", () => {
      expect(checkKeywordValidity('hello')).toBe(false)
      expect(() => encrypt('hello', 'd')).toThrow('Invalid keyword!')
    })

    test('a 27th letter must repeat one of the 26 and is rejected', () => {
      expect(checkKeywordValidity('zyxwvutsrqponmlkjihgfedcbaa')).toBe(false)
    })

    test('empty keyword is rejected by checkInputs before validity', () => {
      expect(() => encrypt('', 'abc')).toThrow(
        'Both keyword and message must be specified'
      )
    })
  })
})
