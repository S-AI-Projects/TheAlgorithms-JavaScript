# R50-T007 — Runnable example for `DisjointSetTreeNode`

Source: `Graphs/KruskalMST.js`, `DisjointSetTreeNode` (line 35 after this change; line 1 at pinned commit `5c39e87`).

## Recorded contract (before any change)

| Aspect                | Observation                                                                                                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Input                 | `key` (any value used as a set member name).                                                                                                                            |
| Result                | node with `key`, `parent === this` and `rank === 0` (lines 38-39): the root of a one-element set.                                                                       |
| Mutation              | none by itself; `DisjointSetTree.link` (lines 68-78) later rewrites `parent` and `rank`.                                                                                |
| External dependencies | none.                                                                                                                                                                   |
| Public interface      | `GraphWeightedUndirectedAdjacencyList` unchanged; `DisjointSetTreeNode` and `DisjointSetTree` are now also exported so the example can import them by their real names. |

There was no test file for `KruskalMST.js` before this change.

## Hand-calculated states (written before running), then compared with a traced run

| Step                           | parents of a, b, c | ranks of a, b, c | Why                                                 |
| ------------------------------ | ------------------ | ---------------- | --------------------------------------------------- |
| `new DisjointSetTreeNode('a')` | a → itself         | 0                | constructor, lines 38-39                            |
| `makeSet` a, b, c              | a, b, c            | 0, 0, 0          | three roots                                         |
| `union('a', 'b')`              | **b**, b, c        | 0, **1**, 0      | equal ranks: `x.parent = y`, `y.rank += 1` (73-75)  |
| `union('c', 'a')`              | b, b, **b**        | 0, 1, 0          | find(a) = b; rank 0 < 1, so c goes below b, no bump |

`trace.txt` holds the traced execution; it matched every row.

**Decisive transition:** joining two roots of _equal_ rank is the only step that raises a rank.
Everything else is either following `parent` links (`findSet`) or hanging a shorter tree under a
taller one with no rank change.

## Executable documentation

The JSDoc above `DisjointSetTreeNode` (lines 1-34) contains an `@example` with `console.log` lines,
each followed by a comment showing what it prints. It is executed in two independent ways:

1. **In the normal test suite** (`Graphs/test/KruskalMST.test.js`). The test reads the block
   straight from the source file and checks that its `import` line names real exports of
   `./KruskalMST.js` (`DisjointSetTreeNode`, `DisjointSetTree`). It then runs the example body
   with exactly those bindings and a captured `console`, and asserts the printed lines equal the
   documented ones: `a true 0`, `b 1`, `b 1`, `0 0`.
2. **Verbatim with Node** (`evidence.mjs`, run by `check.py`). The example is written unchanged,
   import line included, into a temporary ES module next to a copy of `KruskalMST.js`, run with
   `node`, and its real stdout is compared with the documented comments.

If either the documentation or the code drifts, both checks fail.

The test file also asserts the hand-calculated states above, and turns the commented-out example
at the bottom of `KruskalMST.js` into an asserted MST: edges 1-2, 3-4, 2-3 and 4-5 are kept, and
3-5 is skipped because it would close a cycle.

## Sensitivity check (temporary copy only)

`check.py` changes `y.rank += 1` to `y.rank += 2` in a temp copy; the doc-example test fails (prints
`b 2`, documented `b 1`). The real source is untouched.

## How to run

From the repository root:

```sh
python3 work/R50-T007/check.py
```

`check.py` installs dependencies from `package-lock.json`, runs the focused test file, evaluates the fixture with `evidence.mjs` (input, expected, actual and source line for every case), runs each deliberate mutant in a temporary copy, and finally runs the repository test script in non-watch mode (`npm test`, which is `vitest run`). It exits non-zero if any assertion or step fails, and records every command it ran in `commands.log`.

### Recorded run (files in this folder)

| Step                                       | Command                                                                                                                          | Result                                                                    |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Install from lockfile                      | `npm ci --ignore-scripts --no-audit --no-fund` (exit 0)                                                                          | ok                                                                        |
| Focused tests                              | `node_modules/.bin/vitest run Graphs/test/KruskalMST.test.js --reporter=json --outputFile=work/R50-T007/vitest-focused.raw.json` | 5/5 passed                                                                |
| Fixture evidence                           | `node work/R50-T007/evidence.mjs`                                                                                                | 7/7 rows match                                                            |
| Mutant: rank grows by 2 on equal-rank link | temporary copy                                                                                                                   | killed by `prints exactly what the comments next to each console.log say` |
| Repository test script                     | `npm test -- --reporter=json --outputFile=work/R50-T007/vitest-full.raw.json`                                                    | 11975/11975 passed                                                        |

Tool versions (`versions.txt`): python 3.12.10; node v26.13.1; npm 11.20.0; platform macOS-27.2.1-arm64-arm-64bit; vitest vitest/1.2.1 darwin-arm64 node-v26.13.1.

Files: `results.json` (all of the above, machine-readable), `vitest-focused.json` (each focused test and its status), `commands.log`, `versions.txt`.
