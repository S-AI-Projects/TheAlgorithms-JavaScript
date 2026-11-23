# R50-T006 — Simplify one responsibility in `countLetters`

Source: `String/CountLetters.js`, `countLetters` (line 9, unchanged position).

## Recorded contract (before any change)

| Aspect                | Observation                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| Input                 | `str` — must be a string (line 12), without `\W` characters (line 16) and without digits (line 20). |
| Result                | a new object mapping each lower-cased character to its count, keys in first-seen order.             |
| Errors                | `TypeError` with the three messages at lines 13, 17, 21.                                            |
| Mutation              | none (strings are immutable; a new object is returned).                                             |
| External dependencies | none.                                                                                               |
| Quirk kept as-is      | `_` is a word character, so `countLetters('a_b')` is `{ a: 1, _: 1, b: 1 }`.                        |

## Fixture (expected values counted by hand before running)

| Input           | Expected                                               |
| --------------- | ------------------------------------------------------ |
| `''` (smallest) | `{}`                                                   |
| `'Mississippi'` | `{ m: 1, i: 4, s: 4, p: 2 }`, keys `m, i, s, p`        |
| `'HelLo'`       | `{ h: 1, e: 1, l: 2, o: 1 }`                           |
| `0`             | `TypeError: Input should be a string`                  |
| `'two words'`   | `TypeError: Input must not contain special characters` |
| `'h3llo'`       | `TypeError: Input must not contain numbers`            |

## The refactor (one responsibility: tallying the lower-cased input)

Before (original lines 24-30):

```js
const obj = {}
for (let i = 0; i < str.toLowerCase().length; i++) {
  const char = str.toLowerCase().charAt(i)
  obj[char] = (obj[char] || 0) + 1
}
return obj
```

After (lines 24-33):

```js
// Counting is case-insensitive: lower-case the input once, then tally it.
// The guards above only admit ASCII word characters, so `for...of` visits
// exactly the characters the previous index/charAt loop visited.
const lowerCaseStr = str.toLowerCase()
const obj = {}
for (const char of lowerCaseStr) {
  obj[char] = (obj[char] || 0) + 1
}
return obj
```

**The one readability improvement:** the _lower-cased input_ is now a single named value,
`lowerCaseStr`, computed once. The loop walks over it directly, instead of recomputing
`str.toLowerCase()` twice on every iteration (once in the loop condition, once to read the current
character) and indexing into it. Everything else is untouched: same algorithm, return type, key
order, errors, side effects (none) and public argument. The accumulator keeps its name `obj` so the
diff contains only this one change.

This is a readability change, not a claimed optimisation, and not a formatting pass (only this
block of `String/CountLetters.js` changes).

## Guard check (temporary copy only)

`check.py` removes `.toLowerCase()` from the new line in a temp copy. The named regression
`ordinary input: counts are case-insensitive, keys in first-seen order` passes on the refactored
code and fails on the copy (`'Mississippi'` would count `M` and `m` separately). So the tests lock
down exactly the responsibility that was refactored.

## Before/after evidence

- `before-tests.txt`: the 11 tests (6 existing + 5 new) pass on the original code.
- `after-tests.txt`: the same 11 tests pass after the refactor.
- `evidence.mjs` compares the refactored function with an unmodified copy of the original
  (`CountLetters.before.js`) on the fixture plus 300 deterministic generated strings (valid and
  invalid): 0 disagreements in results, key order or error messages.

## How to run

From the repository root:

```sh
python3 work/R50-T006/check.py
```

`check.py` installs dependencies from `package-lock.json`, runs the focused test file, evaluates the fixture with `evidence.mjs` (input, expected, actual and source line for every case), runs each deliberate mutant in a temporary copy, and finally runs the repository test script in non-watch mode (`npm test`, which is `vitest run`). It exits non-zero if any assertion or step fails, and records every command it ran in `commands.log`.

### Recorded run (files in this folder)

| Step                                                   | Command                                                                                                                            | Result                                                  |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Install from lockfile                                  | `npm ci --ignore-scripts --no-audit --no-fund` (exit 0)                                                                            | ok                                                      |
| Focused tests                                          | `node_modules/.bin/vitest run String/test/CountLetters.test.js --reporter=json --outputFile=work/R50-T006/vitest-focused.raw.json` | 11/11 passed                                            |
| Fixture evidence                                       | `node work/R50-T006/evidence.mjs`                                                                                                  | 7/7 rows match                                          |
| Mutant: case folding dropped from the refactored tally | temporary copy                                                                                                                     | killed by `ordinary input: counts are case-insensitive` |
| Repository test script                                 | `npm test -- --reporter=json --outputFile=work/R50-T006/vitest-full.raw.json`                                                      | 11975/11975 passed                                      |

Tool versions (`versions.txt`): python 3.12.10; node v26.13.1; npm 11.20.0; platform macOS-27.2.1-arm64-arm-64bit; vitest vitest/1.2.1 darwin-arm64 node-v26.13.1.

Files: `results.json` (all of the above, machine-readable), `vitest-focused.json` (each focused test and its status), `commands.log`, `versions.txt`.
