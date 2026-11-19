# R50-T015 evidence — degreeToRadian repeatability

- Source contract: `Maths/DegreeToRadian.js:21-23`; pure function of the argument and `Math.PI`, with no external state or dependencies.
- Focused tests: `Maths/test/DegreeToRadian.test.js`. Expected / observed: `0 → 0`; `90 → π/2`; `180 → π`; `45 → π/4` before and after an intervening `180` call.
- Verification command: `python3 work/R50-T015/check.py` (focused Vitest, then full non-watch `npm test`).
- Result: focused 5 tests passed; full suite 346 files and 11,971 tests passed.
- Tools: Python 3.15.2, Node.js v26.12.1, Vitest 1.2.1.
