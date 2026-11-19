# R50-T013 evidence — EulersTotient reference comparison

- Source precondition: `Maths/EulersTotient.js:13-16`; the function accepts a positive integer and returns a scalar.
- Focused tests: `Maths/test/EulersTotient.test.js`. The reference independently counts candidates whose Euclidean GCD with `n` is one.
- Expected / observed for `n = 1..20`: `[1,1,2,2,4,2,6,4,6,4,10,4,12,6,8,8,16,6,18,8] / [1,1,2,2,4,2,6,4,6,4,10,4,12,6,8,8,16,6,18,8]`. This includes the smallest input `1 → 1` and ordinary input `9 → 6`.
- Verification command: `python3 work/R50-T013/check.py` (focused Vitest, then full non-watch `npm test`).
- Result: focused 4 tests passed; full suite 346 files and 11,972 tests passed.
- Tools: Python 3.15.2, Node.js v26.12.1, Vitest 1.2.1.
