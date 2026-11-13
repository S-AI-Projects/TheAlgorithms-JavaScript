# WORK_LOG.md: Task R50-T033 (Maths/ExponentialFunction.js)

## Task Information

- **Student**: ANIKET KUMAR NISHAD
- **Task**: R50-T033 · 3 of 10
- **Repository**: https://github.com/S-AI-Projects/TheAlgorithms-JavaScript
- **Assigned working branch**: student/e26b07f0789
- **Target File**: `Maths/ExponentialFunction.js` (`exponentialFunction` near line 9)

---

## 1. Analysis (Step 1)

- **Public Inputs**:
  - `power`: number (exponent $x$ in $e^x$)
  - `n`: number (number of terms in Taylor expansion approximation, $n \ge 0$)
- **Results**:
  - Returns approximation of $e^{power}$ summing up to $n$ terms.
  - Returns $1$ if $n = 0$.
  - Throws `TypeError('Invalid Input')` if `power` or `n` is `NaN` or $n < 0$.
- **Mutation Behavior**:
  - Pure function; does not mutate any inputs or external state.
- **External Dependencies**:
  - JavaScript built-ins: `isNaN`, exponentiation operator `**`.

---

## 2. Independent Reference & Expected Values (Step 2 & 3)

- **Independent Oracle**:
  Calculated mathematically using the Taylor series definition:
  $$\sum_{i=0}^{n-1} \frac{\text{power}^i}{i!} \quad \text{with } 0! = 1$$
- **Smallest Valid Input**:
  - `exponentialFunction(0, 0)` -> `1` (Precondition line 21: $n = 0$ returns 1)
- **Ordinary Input (Representative Result)**:
  - `exponentialFunction(2, 2)` -> `3` (Precondition lines 24-27: $2^0/0! + 2^1/1! = 1 + 2 = 3$)
- **Enumerated Test Table (22 Small Valid Inputs)**:
  - $(0, 0) \to 1$
  - $(0, 1) \to 1$
  - $(0, 2) \to 1$
  - $(0, 5) \to 1$
  - $(1, 0) \to 1$
  - $(1, 1) \to 1$
  - $(1, 2) \to 2$
  - $(1, 3) \to 2.5$
  - $(1, 4) \to 2.6666666666666665$
  - $(1, 5) \to 2.7083333333333335$
  - $(2, 0) \to 1$
  - $(2, 1) \to 1$
  - $(2, 2) \to 3$
  - $(2, 3) \to 5$
  - $(-1, 0) \to 1$
  - $(-1, 1) \to 1$
  - $(-1, 2) \to 0$
  - $(-1, 3) \to 0.5$
  - $(-1, 4) \to 0.33333333333333337$
  - $(0.5, 0) \to 1$
  - $(0.5, 1) \to 1$
  - $(0.5, 2) \to 1.5$
  - $(0.5, 3) \to 1.625$
  - $(2, 20) \to 7.3890560989301735$

---

## 3. Test Runner & Verification (Step 4 & 5)

- Script: `work/R50-T033/check.py`
- Command: `python3 work/R50-T033/check.py`
- Non-zero test count: 27 assertions in focused suite (all passed).
- Repository full suite: 347 test files passed.

---

## 4. Documentation & Style (Step 6)

- Updated JSDoc in `Maths/ExponentialFunction.js` detailing the representative result $(2, 2) \to 3$.
- Formatted with Prettier and verified via `npm run check-style`.
