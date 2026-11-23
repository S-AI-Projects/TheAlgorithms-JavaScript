# R50-T004 — Invariant tests for `swap` (Odd–Even Sort)

Source: `Sorts/OddEvenSort.js`, `swap` (line 22 after this change; line 10 at pinned commit `5c39e87`).

## Recorded contract (before any change)

| Aspect                | `swap(arr, i, j)`                        | `oddEvenSort(arr)`                                       |
| --------------------- | ---------------------------------------- | -------------------------------------------------------- |
| Inputs                | array, two indices                       | array of mutually comparable numbers (compared with `>`) |
| Result                | `undefined`                              | the **same** array, sorted ascending (`return arr`)      |
| Mutation              | exchanges `arr[i]` and `arr[j]` in place | sorts `arr` in place                                     |
| External dependencies | none                                     | none                                                     |

`swap` is now exported (with JSDoc) so the invariant can be tested directly. The sort keeps its
ascending interface; no descending mode exists in the source.

## Invariant and why it holds

`swap` only exchanges two positions, so the multiset of values (each value and its count) never
changes. `oddEvenSort` moves values **only** through `swap`, and stops only when a full odd pass and a
full even pass make no swap, i.e. no adjacent pair is out of order. Hence the output is:

1. ordered: `out[k] <= out[k + 1]`;
2. a permutation of the input (same multiplicities);
3. the input array itself (`oddEvenSort(a) === a`).

## Fixture (expected values written before running)

| Input           | Expected    |
| --------------- | ----------- |
| `[3, 1, 2]`     | `[1, 2, 3]` |
| `[2, 2, 1]`     | `[1, 2, 2]` |
| `[1, 2, 3]`     | `[1, 2, 3]` |
| `[3, 2, 1]`     | `[1, 2, 3]` |
| `[]` (smallest) | `[]`        |
| `[7]`           | `[7]`       |

`swap([3, 1, 2], 0, 1)` → array becomes `[1, 3, 2]`, returns `undefined`.

## Generator

100 cases from a mulberry32 PRNG with fixed seed `20261123`; length 0..12, integers -5..5, so
repeated values are common (62 of the 100 cases contain a repeat) and the smallest supported
collection `[]` appears 4 times. Only finite integers are generated. `NaN`, mixed types and holes
are outside the comparable-number domain (`>` comparisons at lines 46 and 52), so the generator
never produces them.

The test pins literal generated values so determinism is asserted against explicit expectations:
case 0 is `[4, 0, -1, -2, 0, -1, -5, 1, -4, 0, -3]`. Two readable small cases are retained with
explicit sorted outputs: case 10 `[-2, 5, 5]` → `[-2, 5, 5]` and case 33 `[3, 5, -2]` →
`[-2, 3, 5]`. If a property ever fails, the test reports the shortest failing input.

## Deliberately broken copies (temporary directory only)

| Mutant                                     | Smallest readable failing case | Named assertion that fails              |
| ------------------------------------------ | ------------------------------ | --------------------------------------- |
| `swap`: `arr[j] = tmp` → `arr[j] = arr[i]` | `[2, 1]` → `[1, 1]`            | `output preserves input multiplicities` |
| even pass no longer sets `sorted = false`  | `[3, 1, 2]` → `[1, 3, 2]`      | `output is ordered`                     |

Both mutants are applied by `check.py` to copies in a temp dir; the real source is never edited.
Baseline: all fixture values and both properties held on the unmodified implementation; no defect.

## How to run

From the repository root:

```sh
python3 work/R50-T004/check.py
```

`check.py` installs dependencies from `package-lock.json`, runs the focused test file, evaluates the fixture with `evidence.mjs` (input, expected, actual and source line for every case), runs each deliberate mutant in a temporary copy, and finally runs the repository test script in non-watch mode (`npm test`, which is `vitest run`). It exits non-zero if any assertion or step fails, and records every command it ran in `commands.log`.

### Recorded run (files in this folder)

| Step                                               | Command                                                                                                                          | Result                                            |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Install from lockfile                              | `npm ci --ignore-scripts --no-audit --no-fund` (exit 0)                                                                          | ok                                                |
| Focused tests                                      | `node_modules/.bin/vitest run Sorts/test/OddEvenSort.test.js --reporter=json --outputFile=work/R50-T004/vitest-focused.raw.json` | 17/17 passed                                      |
| Fixture evidence                                   | `node work/R50-T004/evidence.mjs`                                                                                                | 8/8 rows match                                    |
| Mutant: swap loses a value (arr[j] = arr[i])       | temporary copy                                                                                                                   | killed by `output preserves input multiplicities` |
| Mutant: even pass no longer clears the sorted flag | temporary copy                                                                                                                   | killed by `output is ordered`                     |
| Repository test script                             | `npm test -- --reporter=json --outputFile=work/R50-T004/vitest-full.raw.json`                                                    | 11983/11983 passed                                |

Tool versions (`versions.txt`): python 3.12.10; node v26.13.1; npm 11.20.0; platform macOS-27.2.1-arm64-arm-64bit; vitest vitest/1.2.1 darwin-arm64 node-v26.13.1.

Files: `results.json` (all of the above, machine-readable), `vitest-focused.json` (each focused test and its status), `commands.log`, `versions.txt`.
