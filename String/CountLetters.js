/**
 * @function countLetters
 * @description Given a string, count the number of each letter.
 * @param {String} str - The input string
 * @return {Object} - Object with letters and number of times
 * @example countLetters("hello") => {h: 1, e: 1, l: 2, o: 1}
 */

const countLetters = (str) => {
  const specialChars = /\W/g

  if (typeof str !== 'string') {
    throw new TypeError('Input should be a string')
  }

  if (specialChars.test(str)) {
    throw new TypeError('Input must not contain special characters')
  }

  if (/\d/.test(str)) {
    throw new TypeError('Input must not contain numbers')
  }

  // Counting is case-insensitive: lower-case the input once, then tally it.
  // The guards above only admit ASCII word characters, so `for...of` visits
  // exactly the characters the previous index/charAt loop visited.
  const lowerCaseStr = str.toLowerCase()
  const obj = {}
  for (const char of lowerCaseStr) {
    obj[char] = (obj[char] || 0) + 1
  }

  return obj
}

export { countLetters }
