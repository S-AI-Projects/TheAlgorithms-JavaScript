# WORK_LOG.md: Task R50-T040 (Maths/CoPrimeCheck.js)

## Task Information

- **Student**: ANIKET KUMAR NISHAD
- **Task**: R50-T040 · 10 of 10
- **Issue**: https://github.com/S-AI-Projects/TheAlgorithms-JavaScript/issues/40
- **Repository**: https://github.com/S-AI-Projects/TheAlgorithms-JavaScript
- **Assigned working branch**: `student/e26b07f0789`
- **Target File**: `Maths/CoPrimeCheck.js` (`CoPrimeCheck` near line 21)

---

## Tool Versions

- **Node.js**: `v24.19.0`
- **npm**: `11.17.0`
- **Python**: `3.15.2`
- **Vitest**: `v1.2.1`

---

## 1. Analysis (Step 1)

- **Target Function**: `CoPrimeCheck(firstNumber, secondNumber)` in `Maths/CoPrimeCheck.js`
- **Public Inputs**:
  - `firstNumber`: JavaScript `number` (integer).
  - `secondNumber`: JavaScript `number` (integer).
- **Results**:
  - `boolean`: `true` if $\gcd(firstNumber, secondNumber) = 1$, else `false`.
  - Throws `TypeError` if either argument is not a number (delegated to `GetEuclidGCD`).
- **Mutation Behavior**:
  - Pure function; zero mutations of caller-owned state or arguments.
- **External Dependencies**:
  - `GetEuclidGCD` from `./GetEuclidGCD.js`.

---

## 2. Plausible Mutation Analysis & Regression Planning (Step 2 & 3)

### Plausible One-Line Mutation

- **Target Condition (Line 39)**:
  ```javascript
  return GetEuclidGCD(firstNumber, secondNumber) === 1
  ```
- **Plausible Mutation**:
  ```javascript
  return GetEuclidGCD(firstNumber, secondNumber) <= 1
  ```
  _(or off-by-one boundary mistake `< 2`)._
- **Why it looks valid**: In informal thinking, developers sometimes consider values "up to 1" as coprime.
- **Differentiating Input**:
  - Input: `(0, 0)`
  - Correct implementation: $\gcd(0, 0) = 0 \neq 1 \implies$ `false`.
  - Mutant implementation: $0 \le 1 \implies$ erroneously returns `true`!
- **Domain Fixtures around 1, 2, 9, 11, 12**:
  - `(1, 1)` $\to$ `true` ($\gcd(1, 1) = 1$, smallest valid coprime fixture; Precondition: line 39).
  - `(2, 9)` $\to$ `true` (2 is prime, 9 is composite $3^2$, no shared divisors; Precondition: line 39).
  - `(9, 11)` $\to$ `true` (composite 9 and prime 11 share no divisors; Precondition: line 39).
  - `(9, 12)` $\to$ `false` (composite 9 and 12 share divisor 3; $\gcd(9, 12) = 3$; Precondition: line 39).
  - `(9, 3)` $\to$ `false` (composite 9 has divisor 3, between 2 and $\lfloor\sqrt{9}\rfloor = 3$; Precondition: line 39).

---

## 3. Test Runner & Verification (Step 4 & 5)

- **Runner Script**: `work/R50-T040/check.py`
- **Execution Command**: `python3 work/R50-T040/check.py`
- **Execution Output Summary**:
  - Lockfile verification: ensured `node_modules` present.
  - Focused Suite: `npx vitest run Maths/test/CoPrimeCheck.test.js` -> 18 tests passed.
  - Plausible Mutation Check: Mutated `GetEuclidGCD(...) === 1` to `<= 1` in a temporary copy -> failed as required with non-zero exit code.
  - Full Repository Test Suite (Non-watch): `npm test` -> 347 test files passed, 12,031 tests passed.
  - Prettier Code Style: Passed `npm run check-style`.

---

## 4. Documentation & PR Preparation (Step 6)

- Added JSDoc in `Maths/CoPrimeCheck.js` detailing the invariants, preconditions, and protected return condition.
- Updated `Maths/test/CoPrimeCheck.test.js` with regression assertions protecting against one-line comparison/boundary mutations.
- Maintained task evidence inside `work/R50-T040/`.
