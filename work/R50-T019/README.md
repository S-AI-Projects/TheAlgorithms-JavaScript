# R50-T019 evidence — findUniqueElement scaling

- Source contract: `Bit-Manipulation/UniqueElementInAnArray.js:11`; `n` is `arr.length`, with one reduction pass (`O(n)` time, `O(1)` auxiliary space).
- Focused tests: `Bit-Manipulation/test/UniqueElementInAnArray.test.js`. Expected / observed: `[7] → 7`; `[1,2,1,3,3] → 2`. Benchmark results are descriptive only; correctness is checked outside the timed call. Five repetitions per size, fresh inputs, median and range in milliseconds:

|       n | Expected / observed   | Median ms |          Range ms |
| ------: | --------------------- | --------: | ----------------: |
|  10,001 | 987654321 / 987654321 |  0.046917 | 0.031708–0.078125 |
|  50,001 | 987654321 / 987654321 |  0.152500 | 0.151167–0.167250 |
| 100,001 | 987654321 / 987654321 |  0.301625 | 0.300792–0.310792 |

- Verification command: `python3 work/R50-T019/check.py` (focused Vitest, full non-watch `npm test`, benchmark).
- Result: focused 3 tests passed; full suite 346 files and 11,971 tests passed; all benchmark correctness checks passed. No timing threshold is used.
- Tools: Python 3.15.2, Node.js v26.12.1, Vitest 1.2.1.
