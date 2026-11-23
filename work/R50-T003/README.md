# R50-T003 — Cross-check `getParentPosition` against an independent reference

Source: `Data-Structures/Heap/KeyPriorityQueue.js`, `getParentPosition` (line 36 after this change; line 22 at pinned commit `5c39e87`).

## Recorded contract (before any change)

| Aspect                | Observation                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| Input                 | `position`: non-negative integer index into the heap array (layout described at lines 12-16).     |
| Result                | `Math.floor((position - 1) / 2)`; the root (0) yields `-1`, read as "no parent" (lines 105, 126). |
| Mutation              | None. Pure helper.                                                                                |
| External dependencies | `Math.floor` only.                                                                                |
| Public interface      | `KeyPriorityQueue` unchanged; `getParentPosition` is now also exported so it can be tested.       |

## Oracles (neither calls the function under test)

1. **Reviewed explicit table** for positions 0..24 (25 inputs), written by hand from "children of
   `p` are `2p + 1` and `2p + 2`": `-1, 0, 0, 1, 1, 2, 2, …, 11, 11`.
2. **Different method**: in 1-based heap numbering the parent of `k` is `k >> 1`, so the 0-based
   parent of `p` is `((p + 1) >> 1) - 1`. Compared for positions 0..63.

Result: no mismatch on any of the 89 compared positions. No implementation change was needed.

## Fixture (queue behaviour that depends on `getParentPosition`)

Increasing priorities make the min-heap first-in, first-out. After **every** operation the test
checks the explicit expected key and size, and also compares with an independent reference: a
plain JavaScript array used as a FIFO queue (`push` / `shift`). Size is read from the public
`priorities` map.

| Step | Operation | Expected removed | Expected size                                    |
| ---- | --------- | ---------------- | ------------------------------------------------ |
| 0    | new queue | —                | 0 (`isEmpty() === true`)                         |
| 1    | push A(1) | —                | 1                                                |
| 2    | push B(2) | —                | 2                                                |
| 3    | push C(3) | —                | 3                                                |
| 4    | pop       | A                | 2                                                |
| 5    | pop       | B                | 1                                                |
| 6    | push D(4) | —                | 2                                                |
| 7    | pop       | C                | 1                                                |
| 8    | pop       | D                | 0 (`isEmpty() === true`, documented empty state) |

Removal order: A, B, C, D. Separate instances: pushing into or popping from one queue never changes
another (checked in both directions).

## Sensitivity check (temporary copy only)

`check.py` copies the source and test into a temp dir and replaces the formula with
`Math.floor(position / 2)`. The minimal reproducible case is `getParentPosition(0)`: expected `-1`,
mutant `0`. The named test `explicit table: parent of position 0 is -1` fails, along with the existing
push/pop tests. The real source is never modified.

## Observation, not changed (out of scope)

`pop()` on an empty queue returns `undefined` and stays empty (`isEmpty() === true`), but
`_swap(0, -1)` leaves a stray `"-1"` property on the internal `_heap` array. This is undocumented
behaviour that does not affect `getParentPosition`, so it is only recorded here (`baseline.txt`).

## How to run

From the repository root:

```sh
python3 work/R50-T003/check.py
```

`check.py` installs dependencies from `package-lock.json`, runs the focused test file, evaluates the fixture with `evidence.mjs` (input, expected, actual and source line for every case), runs each deliberate mutant in a temporary copy, and finally runs the repository test script in non-watch mode (`npm test`, which is `vitest run`). It exits non-zero if any assertion or step fails, and records every command it ran in `commands.log`.

### Recorded run (files in this folder)

| Step                                             | Command                                                                                                                                              | Result                                                 |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Install from lockfile                            | `npm ci --ignore-scripts --no-audit --no-fund` (exit 0)                                                                                              | ok                                                     |
| Focused tests                                    | `node_modules/.bin/vitest run Data-Structures/Heap/test/KeyPriorityQueue.test.js --reporter=json --outputFile=work/R50-T003/vitest-focused.raw.json` | 38/38 passed                                           |
| Fixture evidence                                 | `node work/R50-T003/evidence.mjs`                                                                                                                    | 36/36 rows match                                       |
| Mutant: parent formula off by one (floor(p / 2)) | temporary copy                                                                                                                                       | killed by `explicit table: parent of position 0 is -1` |
| Repository test script                           | `npm test -- --reporter=json --outputFile=work/R50-T003/vitest-full.raw.json`                                                                        | 11999/11999 passed                                     |

Tool versions (`versions.txt`): python 3.12.10; node v26.13.1; npm 11.20.0; platform macOS-27.2.1-arm64-arm-64bit; vitest vitest/1.2.1 darwin-arm64 node-v26.13.1.

Files: `results.json` (all of the above, machine-readable), `vitest-focused.json` (each focused test and its status), `commands.log`, `versions.txt`.
