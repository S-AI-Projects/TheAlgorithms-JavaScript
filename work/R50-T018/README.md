# R50-T018 evidence — Softmax empty-input failure

- Source branch: `Maths/Softmax.js:5-6`; reducing an empty exponential list without an initial value throws `TypeError`.
- Focused tests: `Maths/test/Softmax.test.js`. Expected / observed: `Softmax([]) → TypeError`; after that failure, `Softmax([0]) → [1]`.
- Verification command: `python3 work/R50-T018/check.py` (focused Vitest, then full non-watch `npm test`).
- Result: focused 3 tests passed; full suite 346 files and 11,971 tests passed.
- Tools: Python 3.15.2, Node.js v26.12.1, Vitest 1.2.1.
