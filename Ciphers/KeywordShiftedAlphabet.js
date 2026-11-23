/**
 * Keyword shifted alphabet is a simple cipher using a translation table created with a help of a keyword.
 * Keyword must be a word where each character can occur only once.
 * To create the translation table, we write all the alphabet characters to the first.
 * Second row start with the keyword, then we continue with the rest of the characters that are missing in alphabetical order.
 *
 * |A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|
 * |K|E|Y|W|O|R|D|A|B|C|F|G|H|I|J|L|M|N|P|Q|S|T|U|V|X|Z|
 *
 * Encryption is then just a matter of writing the matching (same index) letter from the second row instead of the first row:
 * 'Hello world' -> 'Aoggj ujngw'
 *
 * Decryption is then just the reverse process of writing the matching (same index) letter from the first row instead of the second row
 * 'Aoggj ujngw' -> 'Hello world'
 *
 * Non alphabetical characters (space, exclamation mark, ...) are kept as they are
 */

const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
]

/**
 * Checks the keyword rule stated at the top of this file:
 * "Keyword must be a word where each character can occur only once."
 *
 * Supported boundaries:
 * - 'a' (one character) is the smallest valid keyword -> true
 * - a keyword using all 26 letters once is the largest valid keyword -> true
 * - any repeated character, e.g. 'aa' or 'hello', is invalid -> false
 * - '' is never reached through encrypt/decrypt: checkInputs rejects it first
 *   with 'Both keyword and message must be specified'.
 * Characters are compared exactly as given (no case folding).
 *
 * @param {string} keyword
 * @returns {boolean} true when no character occurs more than once
 * @example checkKeywordValidity('keyword') // true
 * @example checkKeywordValidity('hello') // false ('l' repeats)
 */
function checkKeywordValidity(keyword) {
  // `every` stops and returns false on the first repeated character.
  // (A `return false` inside `forEach` only left the callback, so repeated
  // characters were previously accepted.)
  return keyword.split('').every((char, index) => {
    const rest = keyword.slice(0, index) + keyword.slice(index + 1)
    return rest.indexOf(char) === -1
  })
}

function getEncryptedAlphabet(keyword) {
  const encryptedAlphabet = keyword.split('')
  alphabet.forEach((char) => {
    if (encryptedAlphabet.indexOf(char) === -1) {
      encryptedAlphabet.push(char)
    }
  })
  return encryptedAlphabet
}

function translate(sourceAlphabet, targetAlphabet, message) {
  return message.split('').reduce((encryptedMessage, char) => {
    const isUpperCase = char === char.toUpperCase()
    const encryptedCharIndex = sourceAlphabet.indexOf(char.toLowerCase())
    const encryptedChar =
      encryptedCharIndex !== -1 ? targetAlphabet[encryptedCharIndex] : char
    encryptedMessage += isUpperCase
      ? encryptedChar.toUpperCase()
      : encryptedChar
    return encryptedMessage
  }, '')
}

function checkInputs(keyword, message) {
  if (!keyword || !message) {
    throw new Error('Both keyword and message must be specified')
  }

  if (!checkKeywordValidity(keyword)) {
    throw new Error('Invalid keyword!')
  }
}

function encrypt(keyword, message) {
  checkInputs(keyword, message)
  return translate(
    alphabet,
    getEncryptedAlphabet(keyword.toLowerCase()),
    message
  )
}

function decrypt(keyword, message) {
  checkInputs(keyword, message)
  return translate(
    getEncryptedAlphabet(keyword.toLowerCase()),
    alphabet,
    message
  )
}

export { encrypt, decrypt, checkKeywordValidity }

// encrypt('keyword', 'Hello world!') // Prints 'Aoggj ujngw!'
// decrypt('keyword', 'Aoggj ujngw!') // Prints 'Hello world!
