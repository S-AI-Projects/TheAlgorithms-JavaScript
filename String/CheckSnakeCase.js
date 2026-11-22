// CheckSnakeCase method checks the given string is in snake_case or not.

// Problem Source & Explanation: https://en.wikipedia.org/wiki/Naming_convention_(programming)

/**
 * checkSnakeCase method returns true if the string is in snake_case, else returns false.
 *
 * Representative Reference Comparison:
 * For a representative input such as 'docker_build', checkSnakeCase evaluates to `true`
 * because it contains an underscore partitioning word components. Conversely, strings
 * lacking underscores (such as 'dockerBuild' or the smallest valid input '') evaluate to `false`.
 *
 * Precondition Check:
 * - Line 12 establishes: `if (typeof varName !== 'string')`
 *   Throws `TypeError('Argument is not a string.')` for non-string inputs.
 *
 * @param {String} varName the name of the variable to check.
 * @returns {Boolean} return true if the string is in snake_case, else return false.
 * @throws {TypeError} Argument is not a string (established at Line 12).
 */
const checkSnakeCase = (varName) => {
  // firstly, check that input is a string or not.
  if (typeof varName !== 'string') {
    throw new TypeError('Argument is not a string.')
  }

  const pat = /(.*?)_([a-zA-Z])*/
  return pat.test(varName)
}

export { checkSnakeCase }
