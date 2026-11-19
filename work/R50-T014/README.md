# R50-T014 evidence — SimplifiedWiggleSort invariant

- Source contract: `Sorts/SimplifiedWiggleSort.js:1-7` defines weak wiggle order (`<=`, then `>=`) and the observable input sort; the function returns a separate wiggle array.
- Focused tests: `Sorts/test/SimplifiedWiggleSort.test.js`. Expected / observed outputs: `[3,1,2]` → `[1,3,2]`; `[2,2,1]` → `[1,2,2]`; `[1,2,3]` → `[1,3,2]`; `[3,2,1]` → `[1,3,2]`; `[7]` → `[7]`. The input array is confirmed sorted in place and the output is checked for wiggle order and matching multiplicities.
- Generated cases: 100 deterministic bounded arrays passed the same invariant checks.
- Mutation check: `work/R50-T014/mutation-check.mjs` drops one output element in a temporary module; the multiset assertion detects it.
- Baseline reproduction: the original QuickSelect implementation timed out after 3 seconds on `[-1,3,-1,-4,-5,0,4,2,4,5]`; the updated implementation returns and passes the wiggle-order and multiset assertions.
- Verification command: `python3 work/R50-T014/check.py` (focused Vitest, full non-watch `npm test`, mutation check).
- Result: focused 12 tests passed; full suite 346 files and 11,978 tests passed; mutant detected.
- Tools: Python 3.15.2, Node.js v26.12.1, Vitest 1.2.1.
