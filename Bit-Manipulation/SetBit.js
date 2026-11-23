/*
 * Setting Bit: https://www.geeksforgeeks.org/set-k-th-bit-given-number/
 *
 * To set any bit we use bitwise OR (|) operator.
 *
 * Bitwise OR (|) compares the bits of the 32
 * bit binary representations of the number and
 * returns a number after comparing each bit.
 *
 * 0 | 0 -> 0
 * 0 | 1 -> 1
 * 1 | 0 -> 1
 * 1 | 1 -> 1
 *
 * In-order to set kth bit of a number (where k is the position where bit is to be changed)
 * we need to shift 1 k times to its left and then perform bitwise OR operation with the
 * number and result of left shift performed just before.
 *
 * References:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR
 */

/**
 * Returns `number` with the bit at `bitPosition` set to 1.
 *
 * Contract:
 * - `number` is treated as a 32-bit integer (see the note above), so the
 *   result is always a signed 32-bit integer.
 * - `bitPosition` is zero based and supported in the range 0..31.
 *   Position 31 is the sign bit, so `setBit(0, 31)` returns -2147483648.
 * - Setting a bit that is already 1 returns the same value
 *   (`setBit(7, 1) === 7`).
 * - The function is pure: it mutates nothing and only returns a value.
 *
 * @param {number} number
 * @param {number} bitPosition - zero based.
 * @return {number}
 * @example setBit(0, 0) // 1
 * @example setBit(5, 1) // 7 (0b101 -> 0b111)
 */

export const setBit = (number, bitPosition) => {
  return number | (1 << bitPosition)
}
