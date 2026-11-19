# R50-T020 evidence — palindrome partition mutation resistance

- Source contract: `Recursive/PalindromePartitioning.js:8-24`; input is a string, with no normalization before checking palindrome prefixes.
- Focused tests: `Recursive/test/PalindromePartitioning.test.js`. Expected / observed: `"" → [[]]`; `"a" → [["a"]]`; `"ab" → [["a","b"]]`; `"aba" → [["a","b","a"],["aba"]]`; `"abba" → [["a","b","b","a"],["a","bb","a"],["abba"]]`. Every returned component equals its reversal.
- Mutation check: `work/R50-T020/mutation-check.mjs` changes the loop boundary in a temporary copy; the same named “single character returns one palindrome partition” assertion detects the mutation.
- Verification command: `python3 work/R50-T020/check.py` (focused Vitest, full non-watch `npm test`, mutation check).
- Result: focused 7 tests passed; full suite 346 files and 11,977 tests passed; mutant detected.
- Tools: Python 3.15.2, Node.js v26.12.1, Vitest 1.2.1.
