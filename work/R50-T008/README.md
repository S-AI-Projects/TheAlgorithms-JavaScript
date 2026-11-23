# R50-T008 — Failure / absent-result behaviour of `TrieNode`

Source: `Data-Structures/Tree/Trie.js`, `TrieNode` (line 16 after this change; line 1 at pinned commit `5c39e87`).

## Recorded contract (before any change)

| Aspect                  | Observation                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `TrieNode(key, parent)` | stores `key`, `count = 0`, prototype-less `children`; an omitted parent becomes `null` (lines 21-22). |
| Trie API                | `insert`, `findPrefix`, `contains`, `findOccurrences`, `findAllWords`, `remove`.                      |
| Failure policy          | **total**: nothing throws for a missing word. Missing results are `null`, `false`, `0` or `[]`.       |
| Mutation                | only `insert`/`remove` change nodes; lookups only read.                                               |
| External dependencies   | none.                                                                                                 |
| Public interface        | `Trie` unchanged; `TrieNode` is now also exported so tests can check node identity and shape.         |

Because the contract is total, the tests use the documented empty / missing results rather than
inventing an exception.

## Branches exercised (source lines in the final file)

| Branch                                               | Line   | Smallest input that reaches it           | Result                          |
| ---------------------------------------------------- | ------ | ---------------------------------------- | ------------------------------- |
| `findPrefix`: `return null // No such prefix exists` | 76     | `'cab'` after car/cat/dog (stops at `b`) | `null`                          |
| `contains`: `node !== null && node.count !== 0`      | 135    | `'ca'` (node exists, count 0)            | `false`                         |
| `findOccurrences`: `if (node === null) return 0`     | 142    | `'cab'`                                  | `0`                             |
| `findAllWords`: `if (node === null) return output`   | 126    | `'cab'`                                  | `[]`                            |
| non-string guard in `insert` / `findPrefix`          | 52, 70 | `5`                                      | `undefined` / `null`, no change |

## Fixture (expected values written before running)

Insert `"car"`, `"cat"`, `"dog"`:

- `contains('car') === true`, `contains('ca') === false` (prefix only), `findOccurrences('ca') === 0`.
- `findPrefix('cab') === null`, `contains('cab') === false`, `findAllWords('cab')` is `[]`.
- After the failed lookups `findAllWords('')` is unchanged and `findPrefix('cab')` is still `null`
  (no node was created).
- **Successful call after the failure:** `insert('cab')` → `contains('cab') === true`, count 1.
- **Repeated insertion:** inserting `'car'` again reuses the same node and makes its count 2.

Baseline (`baseline.txt`) matched every expected value; no defect in these paths.

## Proof that the inputs reach the branches

`evidence.mjs` loads an in-memory copy of the real `Trie.js` in which the two `return null`
statements of `findPrefix` also record a hit (the file on disk is not changed). Running the fixture
gives exactly:

- `findPrefix('ca')` → no hit (returns the prefix node);
- `contains('cab')` → hit at **line 76** with `i = 2`, i.e. the missing child is `'b'`;
- `findPrefix(5)` → hit at **line 70** (non-string guard).

## Sensitivity checks (temporary copies only)

| Mutant applied by `check.py`                           | Named test that passes on the original and fails on the mutant |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| `contains`: drop `&& node.count !== 0` (line 135)      | `prefix 'ca' is not a complete word, but 'car' is`             |
| `findPrefix`: `return null` → `return node` at line 76 | `missing word 'cab' reaches the null branch of findPrefix`     |

The real source is never modified.

## Side observation (not changed)

`remove` only prunes a node when `child.children.constructor === Object`, but `children` is created
with `Object.create(null)` and has no `constructor`, so pruning never runs. Removing `'car'` after
inserting `'car'` and `'cart'` therefore keeps `'cart'` (checked in `baseline.txt`). This leaves
empty nodes behind but returns correct answers, and it is outside this task's scope.

## How to run

From the repository root:

```sh
python3 work/R50-T008/check.py
```

`check.py` installs dependencies from `package-lock.json`, runs the focused test file, evaluates the fixture with `evidence.mjs` (input, expected, actual and source line for every case), runs each deliberate mutant in a temporary copy, and finally runs the repository test script in non-watch mode (`npm test`, which is `vitest run`). It exits non-zero if any assertion or step fails, and records every command it ran in `commands.log`.

### Recorded run (files in this folder)

| Step                                                                    | Command                                                                                                                                  | Result                                                               |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Install from lockfile                                                   | `npm ci --ignore-scripts --no-audit --no-fund` (exit 0)                                                                                  | ok                                                                   |
| Focused tests                                                           | `node_modules/.bin/vitest run Data-Structures/Tree/test/Trie.test.js --reporter=json --outputFile=work/R50-T008/vitest-focused.raw.json` | 7/7 passed                                                           |
| Fixture evidence                                                        | `node work/R50-T008/evidence.mjs`                                                                                                        | 8/8 rows match                                                       |
| Mutant: prefix-only node counted as a word (drop count check)           | temporary copy                                                                                                                           | killed by `prefix 'ca' is not a complete word, but 'car' is`         |
| Mutant: missing-child branch returns the partial prefix instead of null | temporary copy                                                                                                                           | killed by `missing word 'cab' reaches the null branch of findPrefix` |
| Repository test script                                                  | `npm test -- --reporter=json --outputFile=work/R50-T008/vitest-full.raw.json`                                                            | 11977/11977 passed                                                   |

Tool versions (`versions.txt`): python 3.12.10; node v26.13.1; npm 11.20.0; platform macOS-27.2.1-arm64-arm-64bit; vitest vitest/1.2.1 darwin-arm64 node-v26.13.1.

Files: `results.json` (all of the above, machine-readable), `vitest-focused.json` (each focused test and its status), `commands.log`, `versions.txt`.
