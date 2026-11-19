# R50-T011 evidence — LongestIncreasingSubsequence contract

- Source precondition: `Dynamic-Programming/LongestIncreasingSubsequence.js:13-15` handles the empty array and does not write to the input.
- Focused tests: `Dynamic-Programming/tests/LongestIncreasingSubsequence.test.js`.
- Expected / observed: `[]` → `0 / 0`; `[3,1,2,5,4]` → `3 / 3`; `[2,2,2]` → `1 / 1`. A separate assertion confirms the caller array is unchanged. Expected lengths are established by enumerating strictly increasing subsequences.
- Verification command: `python3 work/R50-T011/check.py` (focused Vitest, then full non-watch `npm test`).
- Result: focused 20 tests passed; full suite 346 files and 11,974 tests passed.
- Tools: Python 3.15.2, Node.js v26.12.1, Vitest 1.2.1.
