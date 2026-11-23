# R50-T009 — Measuring the work done by recursive `fibonacci`

Source: `Recursive/FibonacciNumberRecursive.js`, `fibonacci` (line 19 after this change; line 9 at pinned commit `5c39e87`).

## Recorded contract (before any change)

| Aspect                | Observation                                                                           |
| --------------------- | ------------------------------------------------------------------------------------- |
| Input                 | `n`, a non-negative integer index. Zero-based: `F(0) = 0`, `F(1) = 1`.                |
| Result                | `n` when `n < 2` (lines 20-21), else `fibonacci(n - 2) + fibonacci(n - 1)` (line 23). |
| Mutation              | none.                                                                                 |
| External dependencies | none.                                                                                 |

## Fixture (zero-based, as the source defines)

| n   | expected | actual |
| --- | -------- | ------ |
| 0   | 0        | 0      |
| 1   | 1        | 1      |
| 2   | 1        | 1      |
| 5   | 5        | 5      |
| 10  | 55       | 55     |

Baseline: these values were written down before running the code and matched the unmodified
implementation. The only source change is documentation, so behaviour is unchanged.

## Complexity claim (now in the JSDoc)

Input size variable: **n, the index** (not the number of bits of n).

- Calls: `C(0) = C(1) = 1`, `C(n) = 1 + C(n - 1) + C(n - 2)`, which solves to exactly
  `C(n) = 2·F(n + 1) − 1`. Time is therefore Θ(φⁿ), φ ≈ 1.618. The function is deterministic, so
  this is the worst case and every case.
- Space: O(n) recursion depth.

This is a proof-based claim. The experiment below is an **observation** that agrees with it.

## Experiment

- Sizes n = 20, 24, 28 (each +4 should multiply the work by φ⁴ ≈ 6.854). Short, CPU-only run.
- Operation count: calls, counted in an in-memory copy of the real source with a counter added at
  the top of the function body (the file on disk is not changed).
- Timing: the real function, `performance.now()` around the call only, after a warm-up call, 5
  repetitions per size; median and range reported. Process startup, module loading, I/O and JIT
  compilation are outside the timed interval. Inputs are fixed integers, so no random seed is needed;
  each repetition is a fresh call with no cache.
- Every result is checked against an independent iterative implementation **outside** the timed
  interval.

Results from the run committed here (`timings.json`; timings vary by machine and are rewritten on
each run):

| n   | calls (measured) | 2·F(n+1) − 1 | median ms | range ms      |
| --- | ---------------- | ------------ | --------- | ------------- |
| 20  | 21,891           | 21,891       | 0.042     | 0.042 – 0.096 |
| 24  | 150,049          | 150,049      | 0.253     | 0.248 – 0.255 |
| 28  | 1,028,457        | 1,028,457    | 1.734     | 1.73 – 1.739  |

Call ratio between consecutive sizes: **6.854** both times (= φ⁴). Median time ratios: 6.02 and 6.85
— close to φ⁴, with more noise at n = 20 where each call takes well under a millisecond.

Pass/fail depends only on values and exact call counts, never on wall-clock speed.

## Sensitivity check (temporary copy only)

`check.py` widens the base case to `n <= 2` in a temp copy. The named regression `fibonacci(2) is 1`
passes on the original and fails on the copy, which returns 2. The real source is never modified.

## Code change

- JSDoc on `fibonacci`: indexing convention and the complexity statement above.
- One representative regression in the normal tests: indices 0, 1, 2, 5, 10 → 0, 1, 1, 5, 55.

## How to run

From the repository root:

```sh
python3 work/R50-T009/check.py
```

`check.py` installs dependencies from `package-lock.json`, runs the focused test file, evaluates the fixture with `evidence.mjs` (input, expected, actual and source line for every case), runs each deliberate mutant in a temporary copy, and finally runs the repository test script in non-watch mode (`npm test`, which is `vitest run`). It exits non-zero if any assertion or step fails, and records every command it ran in `commands.log`.

### Recorded run (files in this folder)

| Step                                             | Command                                                                                                                                           | Result                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Install from lockfile                            | `npm ci --ignore-scripts --no-audit --no-fund` (exit 0)                                                                                           | ok                            |
| Focused tests                                    | `node_modules/.bin/vitest run Recursive/test/FibonacciNumberRecursive.test.js --reporter=json --outputFile=work/R50-T009/vitest-focused.raw.json` | 9/9 passed                    |
| Fixture evidence                                 | `node work/R50-T009/evidence.mjs`                                                                                                                 | 8/8 rows match                |
| Mutant: base case widened (n < 2 becomes n <= 2) | temporary copy                                                                                                                                    | killed by `fibonacci(2) is 1` |
| Repository test script                           | `npm test -- --reporter=json --outputFile=work/R50-T009/vitest-full.raw.json`                                                                     | 11975/11975 passed            |

Tool versions (`versions.txt`): python 3.12.10; node v26.13.1; npm 11.20.0; platform macOS-27.2.1-arm64-arm-64bit; vitest vitest/1.2.1 darwin-arm64 node-v26.13.1.

Files: `results.json` (all of the above, machine-readable), `vitest-focused.json` (each focused test and its status), `commands.log`, `versions.txt`.
