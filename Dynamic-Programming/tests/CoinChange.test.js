import { change, coinChangeMin } from '../CoinChange'

test('Base Case 1', () => {
  const coins = [2, 3, 5]
  const amount = 0
  expect(change(coins, amount)).toBe(1)
  expect(coinChangeMin(coins, amount)).toBe(0)
})
test('Base Case 2', () => {
  const coins = []
  const amount = 100
  expect(change(coins, amount)).toBe(0)
  expect(coinChangeMin(coins, amount)).toBe(-1)
})
test('Test Case 1', () => {
  const coins = [2, 4, 5]
  const amount = 12
  expect(change(coins, amount)).toBe(5)
  expect(coinChangeMin(coins, amount)).toBe(3)
})
test('Test Case 2', () => {
  const coins = [5, 2, 3, 7, 6, 1, 12, 11, 9, 15]
  const amount = 45
  expect(change(coins, amount)).toBe(12372)
  expect(coinChangeMin(coins, amount)).toBe(3)
})
test('Test Case 3', () => {
  const coins = [2]
  const amount = 3
  expect(change(coins, amount)).toBe(0)
  expect(coinChangeMin(coins, amount)).toBe(-1)
})
test('Test Case 4', () => {
  const coins = [3, 5, 7, 8, 9, 10, 11]
  const amount = 500
  expect(change(coins, amount)).toBe(35502874)
  expect(coinChangeMin(coins, amount)).toBe(46)
})
test('Test Case 5', () => {
  const coins = [10]
  const amount = 10
  expect(change(coins, amount)).toBe(1)
  expect(coinChangeMin(coins, amount)).toBe(1)
})

// Contract regression for change(). Expected values are hand-counted
// combinations. Each title names the CoinChange.js line for its precondition.
// Return values and input mutation are asserted in separate tests.

test('change() smallest supported input returns 1 (CoinChange.js:7, CoinChange.js:10)', () => {
  // Line 7: `new Array(amount + 1)` — smallest supported amount is 0.
  // Line 10: `coins.length` — smallest supported coin list is empty.
  const coins = []
  const amount = 0
  // One combination makes 0: select no coins.
  expect(change(coins, amount)).toBe(1)
})

test('change() does not mutate coins for the smallest input (CoinChange.js:10)', () => {
  // Lines 10-14 read coins.length and coins[i] and never assign to coins.
  const coins = []
  const amount = 0
  change(coins, amount)
  expect(coins).toEqual([])
})

test('change() ordinary input returns 4 (CoinChange.js:12)', () => {
  // Line 12: each coins[i] is a positive integer; the inner loop starts there.
  const coins = [1, 2, 5]
  const amount = 5
  // (5), (2, 2, 1), (2, 1, 1, 1), (1, 1, 1, 1, 1)
  expect(change(coins, amount)).toBe(4)
})

test('change() does not mutate coins for the ordinary input (CoinChange.js:10)', () => {
  // Lines 10-14 only read the coin array.
  const coins = [1, 2, 5]
  const amount = 5
  change(coins, amount)
  expect(coins).toEqual([1, 2, 5])
})

test('change() repeated coin below every coin returns 0 (CoinChange.js:10, CoinChange.js:12)', () => {
  // Line 10 visits every index, including a repeated value.
  // Line 12 starts at j = coins[i], so amount < every coin adds nothing.
  const coins = [2, 2]
  const amount = 1
  // Both entries are 2. No sum of 2s equals 1.
  expect(change(coins, amount)).toBe(0)
})

test('change() does not mutate a repeated coin list (CoinChange.js:10)', () => {
  // Lines 10-14 only read the coin array, including duplicate values.
  const coins = [2, 2]
  const amount = 1
  change(coins, amount)
  expect(coins).toEqual([2, 2])
})
