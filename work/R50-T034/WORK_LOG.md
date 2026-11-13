# WORK_LOG.md: Task R50-T034 (Conversions/OctToDecimal.js)

## Task Information

- **Student**: ANIKET KUMAR NISHAD
- **Task**: R50-T034 · 4 of 10
- **Issue**: https://github.com/S-AI-Projects/TheAlgorithms-JavaScript/issues/34
- **Repository**: https://github.com/S-AI-Projects/TheAlgorithms-JavaScript
- **Assigned working branch**: `student/e26b07f0789/R50-T034` (base branch: `student/e26b07f0789`)
- **Target File**: `Conversions/OctToDecimal.js` (`octalToDecimal` near line 1)

---

## Tool Versions

- **Node.js**: `v24.19.0`
- **npm**: `11.17.0`
- **Python**: `3.15.2`
- **Vitest**: `v1.2.1`

---

## 1. Analysis (Step 1)

- **Target Function**: `octalToDecimal(num)` in `Conversions/OctToDecimal.js`
- **Public Inputs**:
  - `num`: JavaScript `number` representing an octal value using base-10 digits (each digit in range 0–7).
- **Results**:
  - Non-negative finite JavaScript integer (`number`) representing the decimal conversion $\sum_{i=0}^{k-1} d_i \cdot 8^i$.
- **Mutation Behavior**:
  - Function is pure and does not mutate any inputs or external state. Primitive numbers in JavaScript are passed by value and immutable.
- **External Dependencies**:
  - Standard JavaScript built-in functions: `Math.floor` for integer division.

---

## 2. Invariants & Fixtures (Step 2 & 3)

### Documented Invariants

1. **Output Type and Shape Invariant**: For any valid input `x`, `typeof octalToDecimal(x) === 'number'`, `Number.isInteger(octalToDecimal(x))` is true, and the result is $\ge 0$.
2. **Identity / Round-Trip Invariant**: For any valid octal integer $x$ whose decimal digits are in $0..7$, `octalToDecimal(x) === parseInt(String(x), 8)`.
3. **Monotonic Ordering Invariant**: For any two valid octal integers $a < b$, `octalToDecimal(a) < octalToDecimal(b)`.
4. **Input Non-Mutation & Fresh Equivalent Comparison**: Given fresh equivalent inputs $a_1 === a_2$, `octalToDecimal(a_1) === octalToDecimal(a_2)` without modifying inputs or external environment state.

### Fixtures (Source Line Establishing Preconditions)

- **Smallest Valid Input**:
  - Input: `0`
  - Independently calculated expected output: `0` ($0 \cdot 8^0 = 0$)
  - Precondition source lines: `Conversions/OctToDecimal.js` line 21 (`dec = 0`), line 23 (`while (num > 0)` loop condition evaluates to false for `0`, returning initial `dec = 0`).
- **Representative Ordinary Input**:
  - Input: `56`
  - Independently calculated expected output: `46` ($5 \cdot 8^1 + 6 \cdot 8^0 = 40 + 6 = 46$)
  - Precondition source lines: `Conversions/OctToDecimal.js` lines 23–29 (loop extracts digit 6 with base 1, then digit 5 with base 8).
- **Fresh Equivalent Input Fixture**:
  - Inputs: `2365` and `2365`
  - Independently calculated expected output: `1269` ($2 \cdot 8^3 + 3 \cdot 8^2 + 6 \cdot 8^1 + 5 \cdot 8^0 = 1024 + 192 + 48 + 5 = 1269$)
  - Precondition source lines: `Conversions/OctToDecimal.js` lines 20–29.

### Seeded Property Generator

- **Generator Details**: Fixed seed `42` using a Linear Congruential Generator (LCG) ($a = 1664525, c = 1013904223, m = 2^{32}$).
- **Domain Restriction**: Restricts digits strictly to the valid octal alphabet $\{0, 1, 2, 3, 4, 5, 6, 7\}$ of length 1 to 6 digits, ensuring no invalid octal digits (8 or 9) are generated.
- **Sample Size**: 120 generated cases plus boundary small cases (`0`, `1`, `7`, `10`, `56`, `77`), totaling 126 unique evaluated inputs.
- All 126 inputs validated against `parseInt(String(x), 8)`, type/shape invariant, and monotonic order invariant.

---

## 3. Test Runner & Verification (Step 4 & 5)

- **Runner Script**: `work/R50-T034/check.py`
- **Execution Command**: `python3 work/R50-T034/check.py`
- **Execution Output Summary**:
  - Focused Suite: `npx vitest run Conversions/test/OctToDecimal.test.js` -> 9 tests passed (non-zero test count).
  - Deliberate Invariant Mutation Check: Mutated `base = base * 8` to `base = base * 7` in a temporary copy -> tests failed as expected with non-zero exit code, confirming sensitivity.
  - Full Repository Test Suite (Non-watch): `npm test` -> 347 test files passed, 12,009 tests passed.
  - Prettier Code Style Check: `npm run check-style` -> All files matched Prettier code style without warnings.

---

## 4. Documentation & PR Preparation (Step 6)

- Added JSDoc documentation to `Conversions/OctToDecimal.js` detailing:
  - Function behavior and mathematical formula.
  - Smallest valid input fixture ($0 \to 0$).
  - Representative ordinary input fixture ($56 \to 46$).
  - Formal property invariants (output type/shape, round-trip, monotonicity, and non-mutation).
- Maintained clean separation of coursework artifacts in `work/R50-T034/`.
