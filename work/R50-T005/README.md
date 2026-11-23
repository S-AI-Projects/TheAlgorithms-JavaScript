# R50-T005 — Repeatable verification of `newGeneration`

Source: `Cellular-Automata/ConwaysGameOfLife.js`, `newGeneration` (line 24 after this change; line 14 at pinned commit `5c39e87`).

## Recorded contract (before any change)

| Aspect                | Observation                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------- |
| Input                 | `cells`: rectangular grid of `0`/`1`. Cells outside the grid count as dead (no wrap-around). |
| Result                | a **new** grid of the same shape (lines 25, 27 create fresh arrays; line 53 returns it).     |
| Mutation              | none — `cells` is only read (e.g. line 43).                                                  |
| External dependencies | **none**. No `Date`, `Math.random`, imports, network, I/O, console or module-level state.    |

Because the function is already pure, no dependency seam was introduced (none is needed, so no new
parameter and no change for existing callers). The code change is a JSDoc block stating the
determinism / isolation contract, plus regression tests that lock it down.

## Fixture (expected grids worked out by hand from rules 1–3, lines 4–6)

| Case                    | Input                        | Expected                                     |
| ----------------------- | ---------------------------- | -------------------------------------------- |
| Smallest valid input    | `[]`                         | `[]`                                         |
| Smallest non-empty grid | `[[1]]`                      | `[[0]]` (0 neighbours → dies)                |
| Ordinary input (glider) | `.#... / ..#.. / ###.. / … ` | `..... / #.#.. / .##.. / .#... / .....`      |
| Other input (block)     | `[[1,1],[1,1]]`              | `[[1,1],[1,1]]` (each cell has 3 → survives) |

Glider by hand: (1,0) has 3 live neighbours → born; (1,2) 3 → survives; (2,1) 3 → survives;
(2,2) 2 → survives; (3,1) 3 → born; (0,1) and (2,0) have 1 each → die; (1,1) has 5 → stays dead.

## Repeatability / isolation checks

1. Glider run twice from fresh copies → identical results.
2. Glider, then the block (whose returned grid is then tampered with), then the glider again →
   still the same result; earlier runs cannot change a later one.
3. Input grid is deep-equal to a fresh copy after the call.
4. A deeply frozen input grid is accepted and gives the expected result. ES modules run in strict
   mode, so any write to the input would throw.
5. The output is a different array and shares no row arrays with the input.

The "no dependencies" statement is checked, not just asserted. `evidence.mjs` strips comments from
the real source and scans it for `Date`, `Math`, `performance`, `process`, `require`, `import`,
`fetch`, `console`, timers and browser/global objects, and lists any module-level variables.
Both lists are empty. As a negative control, adding `Math.random()` to a copy of the function made
the scan report `["Math"]` and fail.

All checks run in plain Node/Vitest: no network, account or GUI.

## Sensitivity check (temporary copy only)

A mutant that writes the computed state back into `cells` is applied to a temp copy by `check.py`;
`does not modify the input grid` and 5 other tests fail. The real source is untouched.

Baseline: all expected values matched the unmodified implementation; no defect found.

## How to run

From the repository root:

```sh
python3 work/R50-T005/check.py
```

`check.py` installs dependencies from `package-lock.json`, runs the focused test file, evaluates the fixture with `evidence.mjs` (input, expected, actual and source line for every case), runs each deliberate mutant in a temporary copy, and finally runs the repository test script in non-watch mode (`npm test`, which is `vitest run`). It exits non-zero if any assertion or step fails, and records every command it ran in `commands.log`.

### Recorded run (files in this folder)

| Step                                                   | Command                                                                                                                                            | Result                                     |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Install from lockfile                                  | `npm ci --ignore-scripts --no-audit --no-fund` (exit 0)                                                                                            | ok                                         |
| Focused tests                                          | `node_modules/.bin/vitest run Cellular-Automata/test/ConwaysGameOfLife.test.js --reporter=json --outputFile=work/R50-T005/vitest-focused.raw.json` | 9/9 passed                                 |
| Fixture evidence                                       | `node work/R50-T005/evidence.mjs`                                                                                                                  | 9/9 rows match                             |
| Mutant: writes the next state back into the input grid | temporary copy                                                                                                                                     | killed by `does not modify the input grid` |
| Repository test script                                 | `npm test -- --reporter=json --outputFile=work/R50-T005/vitest-full.raw.json`                                                                      | 11978/11978 passed                         |

Tool versions (`versions.txt`): python 3.12.10; node v26.13.1; npm 11.20.0; platform macOS-27.2.1-arm64-arm-64bit; vitest vitest/1.2.1 darwin-arm64 node-v26.13.1.

Files: `results.json` (all of the above, machine-readable), `vitest-focused.json` (each focused test and its status), `commands.log`, `versions.txt`.
