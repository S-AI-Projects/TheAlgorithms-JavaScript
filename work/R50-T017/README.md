# R50-T017 evidence — executable powLogarithmic example

- Source contract/example: `Maths/PowLogarithmic.js:17-25`; the worked odd-exponent step is `3^5 = powLogarithmic(3,2)^2 × 3 = 9 × 9 × 3 = 243`.
- Focused tests: `Maths/test/PowLogarithmic.test.js`. The test reads the example call and expected value from the JSDoc, parses them, and executes that documented call. Expected / observed examples: `3^5 → 243`; `7^0 → 1`; `2^1 → 2`.
- Verification command: `python3 work/R50-T017/check.py` (focused Vitest, then full non-watch `npm test`).
- Result: focused 4 tests passed; full suite 346 files and 11,971 tests passed.
- Tools: Python 3.15.2, Node.js v26.12.1, Vitest 1.2.1.
