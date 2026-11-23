# R50-T002 — Supported boundaries of `checkKeywordValidity`

Source: `Ciphers/KeywordShiftedAlphabet.js`, `checkKeywordValidity` (line 65 after this change; line 48 at pinned commit `5c39e87`).

## Recorded contract (before any change)

| Aspect                | Observation                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| Input                 | `keyword` (string). Only called from `checkInputs`, after the empty-input guard (line 99).         |
| Result                | boolean — "Keyword must be a word where each character can occur only once" (line 3).              |
| Mutation              | None (strings are immutable).                                                                      |
| External dependencies | None.                                                                                              |
| Public interface      | `encrypt`, `decrypt` (unchanged). `checkKeywordValidity` is now also exported so it can be tested. |

## Boundary table (expected values written before running the source)

| Partition                 | Input                          | Expected                                                       | Source contract |
| ------------------------- | ------------------------------ | -------------------------------------------------------------- | --------------- |
| valid boundary (smallest) | `'a'`                          | `true`; `encrypt('a','abc') === 'abc'`                         | line 3          |
| valid interior            | `'keyword'`                    | `true`; `encrypt('keyword','Hello world!') === 'Aoggj ujngw!'` | lines 3, 8      |
| valid boundary (largest)  | `'zyxwvutsrqponmlkjihgfedcba'` | `true`; `encrypt(…,'abc') === 'zyx'`                           | line 3          |
| invalid boundary          | `'aa'`                         | `false`; `encrypt` throws `Invalid keyword!`                   | lines 3, 104    |
| invalid interior          | `'hello'`                      | `false`; `encrypt` throws `Invalid keyword!`                   | lines 3, 104    |
| invalid (27 letters)      | 26 letters + `'a'`             | `false`                                                        | line 3          |
| unsupported (empty)       | `''`                           | `encrypt` throws `Both keyword and message must be specified`  | line 99-100     |

Not covered on purpose: mixed-case repeats such as `'Aa'` and non-letter keywords. The source does
not define them, so no new rule was added for them.

## Baseline — defect found

Running the fixture against the original source (`baseline.txt`):

- `encrypt('aa', 'abc')` returned `"aab"` instead of throwing `Invalid keyword!`.
- `encrypt('hello', 'd')` returned `"l"` instead of throwing.
- Round trip broke: `decrypt('hello', encrypt('hello', 'd'))` returned `"c"`, not `"d"`.

Cause: `return false` inside `keyword.split('').forEach(...)` only returns from the callback, so the
function always reached `return true`.

Order of work and evidence: the baseline above was recorded on the original, unedited source.
The expected values in the boundary tests come from the documented contract (line 3), not from
running the fixed code. `negative-control.txt` shows `check.py` run with the original
always-`true` behaviour put back temporarily: it exits **1** and names the 3 failing
repeated-keyword tests, while the other 6 tests pass. With the fix, all pass.

The fix replaces `forEach` with `every`, which stops and returns `false` on the first repeated
character. It uses the same algorithm and the same case-sensitive comparison. No guard was added
elsewhere.

Documentation corrections in the same header (both confirmed by running the code):

- line 8: the translation-table row listed `W` twice and omitted `X` (`…U|V|W|Z|` → `…U|V|X|Z|`);
- line 14: the decryption example was missing a letter (`'Aogg ujngw'` → `'Aoggj ujngw'`).

## Sensitivity check (temporary copy only)

On every run, `check.py` also applies the original defect (`return true` for every character) to a
temp copy of the source. The named test `smallest repeated keyword 'aa' is rejected` passes on the
fixed code and fails on that copy.

## How to run

From the repository root:

```sh
python3 work/R50-T002/check.py
```

`check.py` installs dependencies from `package-lock.json`, runs the focused test file, evaluates the fixture with `evidence.mjs` (input, expected, actual and source line for every case), runs each deliberate mutant in a temporary copy, and finally runs the repository test script in non-watch mode (`npm test`, which is `vitest run`). It exits non-zero if any assertion or step fails, and records every command it ran in `commands.log`.

### Recorded run (files in this folder)

| Step                                                        | Command                                                                                                                                       | Result                                                 |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Install from lockfile                                       | `npm ci --ignore-scripts --no-audit --no-fund` (exit 0)                                                                                       | ok                                                     |
| Focused tests                                               | `node_modules/.bin/vitest run Ciphers/test/KeywordShiftedAlphabet.test.js --reporter=json --outputFile=work/R50-T002/vitest-focused.raw.json` | 9/9 passed                                             |
| Fixture evidence                                            | `node work/R50-T002/evidence.mjs`                                                                                                             | 10/10 rows match                                       |
| Mutant: original defect restored (every character accepted) | temporary copy                                                                                                                                | killed by `smallest repeated keyword 'aa' is rejected` |
| Repository test script                                      | `npm test -- --reporter=json --outputFile=work/R50-T002/vitest-full.raw.json`                                                                 | 11977/11977 passed                                     |

Tool versions (`versions.txt`): python 3.12.10; node v26.13.1; npm 11.20.0; platform macOS-27.2.1-arm64-arm-64bit; vitest vitest/1.2.1 darwin-arm64 node-v26.13.1.

Files: `results.json` (all of the above, machine-readable), `vitest-focused.json` (each focused test and its status), `commands.log`, `versions.txt`.
