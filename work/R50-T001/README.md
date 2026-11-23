# R50-T001 — Contract regression tests for `setBit`

Source: `Bit-Manipulation/SetBit.js`, `setBit` (line 42 after this change; line 29 at the pinned commit `5c39e87`).

## Recorded contract (before any change)

| Aspect                | Observation                                                                            |
| --------------------- | -------------------------------------------------------------------------------------- |
| Inputs                | `number` (number), `bitPosition` (number, zero based — line 36)                        |
| Result                | `number \| (1 << bitPosition)`, a signed 32-bit integer (bitwise operators, lines 6-7) |
| Mutation              | None. Both arguments are primitives; the function only returns a value.                |
| External dependencies | None.                                                                                  |

## Fixture (expected values calculated by hand before running the source)

| Case                      | Input     | Expected      | Why                                | Source line |
| ------------------------- | --------- | ------------- | ---------------------------------- | ----------- |
| Smallest valid input      | `(0, 0)`  | `1`           | `0b0 \| 0b1`                       | 36          |
| Ordinary input            | `(5, 1)`  | `7`           | `0b101 \| 0b010 = 0b111`           | 36          |
| Repeated value (bit set)  | `(7, 1)`  | `7`           | `1 \| 1 -> 1`                      | 13          |
| Boundary: highest +ve bit | `(0, 30)` | `1073741824`  | `2^30`                             | 6-7         |
| Boundary: sign bit        | `(0, 31)` | `-2147483648` | `0x80000000` read as signed 32-bit | 6-7         |
| Arguments unchanged       | `(5, 1)`  | `5`, `1`      | primitives, pure function          | 42-44       |

## Baseline

All expected values matched the unmodified implementation, so no defect was found and the
implementation was not changed. The only source change is a JSDoc contract beside `setBit`.

## Sensitivity check (temporary copy only)

`check.py` copies the source and test file into a temp dir and replaces `|` with `^` (toggle instead
of set), a plausible one-character mistake. The named test
`repeated value: setting a bit that is already set is a no-op` passes on the original and fails on
the mutant (`setBit(7, 1)` becomes `5`), together with two existing tests. The real source is never
modified.

## How to run

From the repository root:

```sh
python3 work/R50-T001/check.py
```

`check.py` installs dependencies from `package-lock.json`, runs the focused test file, evaluates the fixture with `evidence.mjs` (input, expected, actual and source line for every case), runs each deliberate mutant in a temporary copy, and finally runs the repository test script in non-watch mode (`npm test`, which is `vitest run`). It exits non-zero if any assertion or step fails, and records every command it ran in `commands.log`.

### Recorded run (files in this folder)

| Step                              | Command                                                                                                                                | Result             |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------ |
| Install from lockfile             | `npm ci --ignore-scripts --no-audit --no-fund` (exit 0)                                                                                | ok                 |
| Focused tests                     | `node_modules/.bin/vitest run Bit-Manipulation/test/SetBit.test.js --reporter=json --outputFile=work/R50-T001/vitest-focused.raw.json` | 10/10 passed       |
| Fixture evidence                  | `node work/R50-T001/evidence.mjs`                                                                                                      | 6/6 rows match     |
| Mutant: toggles instead of sets ( | replaced by ^)                                                                                                                         | temporary copy     | killed by `repeated value: setting a bit that is already set is a no-op` |
| Repository test script            | `npm test -- --reporter=json --outputFile=work/R50-T001/vitest-full.raw.json`                                                          | 11976/11976 passed |

Tool versions (`versions.txt`): python 3.12.10; node v26.13.1; npm 11.20.0; platform macOS-27.2.1-arm64-arm-64bit; vitest vitest/1.2.1 darwin-arm64 node-v26.13.1.

Files: `results.json` (all of the above, machine-readable), `vitest-focused.json` (each focused test and its status), `commands.log`, `versions.txt`.
