/*
    Problem statement and Explanation : https://en.wikipedia.org/wiki/Coprime_integers

    In number theory, two integers a and b are coprime, relatively prime or
    mutually prime if the only positive integer that is a divisor of both
    of them is 1. Consequently, any prime number that divides one of a
    or b does not divide the other. This is equivalent to their greatest
    common divisor (gcd) being 1. One says also a is prime to b or a
    is coprime with b.
*/

import { GetEuclidGCD } from './GetEuclidGCD'

/**
 * CoPrimeCheck checks if two integers are coprime (relatively prime).
 *
 * Invariants & Preconditions:
 * - Both inputs must be JavaScript numbers (throws TypeError if non-number).
 * - Two numbers a and b are coprime if and only if gcd(a, b) === 1.
 * - Sieve domain around 1, 2, 9, 11:
 *   - CoPrimeCheck(1, 1) === true (gcd(1, 1) === 1)
 *   - CoPrimeCheck(2, 9) === true (gcd(2, 9) === 1; 2 is prime, 9 is composite = 3^2)
 *   - CoPrimeCheck(9, 11) === true (gcd(9, 11) === 1; composite 9 and prime 11 share no divisors)
 *   - CoPrimeCheck(9, 12) === false (gcd(9, 12) === 3 !== 1; composite 9 and 12 share divisor 3)
 *
 * Protected from plausible one-line mutation:
 * - Return condition mutation (e.g. `GetEuclidGCD(...) <= 1` or off-by-one `< 2` vs `=== 1` or ignoring composite factors).
 *
 * @param {number} firstNumber - First integer to check.
 * @param {number} secondNumber - Second integer to check.
 * @returns {boolean} `true` if gcd(firstNumber, secondNumber) === 1, else `false`.
 * @throws {TypeError} If either argument is not a number.
 */
const CoPrimeCheck = (firstNumber, secondNumber) => {
  /*
    This is the most efficient algorithm for checking co-primes:
    if the GCD of both numbers is 1 that means they are co-primes.
  */
  return GetEuclidGCD(firstNumber, secondNumber) === 1
}

export { CoPrimeCheck }
