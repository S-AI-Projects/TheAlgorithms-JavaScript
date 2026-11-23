# R50-T010 — Mutation-resistant tests for `OpenKnightTour`

Source: `Backtracking/KnightTour.js`, `OpenKnightTour` (line 3).

## Recorded contract (before any change)

| Aspect                | Observation                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| Input                 | `size` (constructor) — a primitive, so there is no caller-owned input to mutate.                           |
| Output                | `solve()` → boolean; `board` → `size × size` array of numbers, `0` = unvisited.                            |
| Ordering              | `getMoves` returns in-bounds moves in the order of the move list (lines 12-21).                            |
| Mutation              | `solve()` writes into the instance's own `board` only.                                                     |
| External dependencies | none (`printBoard` takes an injectable `output`, not used here).                                           |
| Quirk kept as-is      | `solve()` starts with `curr = 0` and never numbers the start square (line 38), so `n = 1` returns `false`. |

## Fixture (expected outputs established independently)

| Input                         | Expected                                                                                                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `n = 1` (smallest)            | `solve() === false`, board `[[0]]` (see quirk)                                                                                                                                              |
| `n = 3`                       | `solve() === false` (the centre square is unreachable), board **all zeros** after the failed search                                                                                         |
| `n = 5` (ordinary)            | `solve() === true`, board uses each of 1..25 once and every step k → k+1 is a knight move (checked by an independent helper that calls no `OpenKnightTour` method)                          |
| `getMoves([1, 2])` on 3×3     | `[[2, 0], [0, 0]]` — hand-checked against the 8 candidate moves                                                                                                                             |
| two fresh `OpenKnightTour(5)` | both `solve() === true` and both boards equal the explicit board `[[19,4,15,10,25],[14,9,18,5,16],[1,20,3,24,11],[8,13,22,17,6],[21,2,7,12,23]]`; the two board arrays are separate objects |

Baseline: all of these expected values were written down from the source's contract and checked by
hand before running. They matched the unmodified implementation, so the implementation was not
changed (only a comment was added).

## Mutants (applied to temporary copies by `check.py`; the source never contains them)

| One-line mistake                                            | Smallest input where original and mutant differ                         | Named assertion that fails (and why)                                                                                                                                                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backtracking reset `this.board[y][x] = 0` deleted (line 58) | `n = 3`: original board all zeros, mutant `[[2,5,8],[7,0,3],[4,1,6]]`   | `failed search on 3x3 leaves the board all zeros` — numbers from abandoned branches are never undone. On `n = 5` the mutant even returns `true` with repeated numbers, failing `5x5 solution is a valid open tour…`. |
| Lower row bound `y >= 0` → `y > 0` (line 25)                | `n = 3`, `getMoves([1, 2])`: original `[[2,0],[0,0]]`, mutant `[[2,0]]` | `getMoves keeps moves onto row 0 and column 0` — row 0 becomes unreachable, so no 5×5 tour exists either.                                                                                                            |

An **equivalent** mutant was also tried and rejected: `x < this.size` → `x <= this.size`. The extra
column is never chosen because `board[y][size]` is `undefined`, not `0`, so behaviour is unchanged.

The protected condition is documented next to the reset in `KnightTour.js` (lines 53-58). The final
implementation has no mutation and no test-only branch; only a comment was added.

## Follow-up (not changed here)

The `n = 1` result is arguably a defect (a one-square board trivially has a tour). Fixing it means
numbering the start square, which would change every board the existing 5×5 test pins, so it is out
of scope for this task.

## How to run

From the repository root:

```sh
python3 work/R50-T010/check.py
```

`check.py` installs dependencies from `package-lock.json`, runs the focused test file, evaluates the fixture with `evidence.mjs` (input, expected, actual and source line for every case), runs each deliberate mutant in a temporary copy, and finally runs the repository test script in non-watch mode (`npm test`, which is `vitest run`). It exits non-zero if any assertion or step fails, and records every command it ran in `commands.log`.

### Recorded run (files in this folder)

| Step                                       | Command                                                                                                                                 | Result                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Install from lockfile                      | `npm ci --ignore-scripts --no-audit --no-fund` (exit 0)                                                                                 | ok                                                          |
| Focused tests                              | `node_modules/.bin/vitest run Backtracking/tests/KnightTour.test.js --reporter=json --outputFile=work/R50-T010/vitest-focused.raw.json` | 7/7 passed                                                  |
| Fixture evidence                           | `node work/R50-T010/evidence.mjs`                                                                                                       | 7/7 rows match                                              |
| Mutant: backtracking reset removed         | temporary copy                                                                                                                          | killed by `failed search on 3x3 leaves the board all zeros` |
| Mutant: lower row bound off by one (y > 0) | temporary copy                                                                                                                          | killed by `getMoves keeps moves onto row 0 and column 0`    |
| Repository test script                     | `npm test -- --reporter=json --outputFile=work/R50-T010/vitest-full.raw.json`                                                           | 11975/11975 passed                                          |

Tool versions (`versions.txt`): python 3.12.10; node v26.13.1; npm 11.20.0; platform macOS-27.2.1-arm64-arm-64bit; vitest vitest/1.2.1 darwin-arm64 node-v26.13.1.

Files: `results.json` (all of the above, machine-readable), `vitest-focused.json` (each focused test and its status), `commands.log`, `versions.txt`.
