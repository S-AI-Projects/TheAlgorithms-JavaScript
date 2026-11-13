# WORK_LOG.md: Task R50-T032 (Maths/DecimalIsolate.js)

## Overview

- **Task**: R50-T032 · 2 of 10
- **Target File**: `Maths/DecimalIsolate.js` (focus on `decimalIsolate` near line 7)
- **Objective**: Identify the smallest supported domain around `decimalIsolate`, make boundary behavior explicit, test before implementation with literal inputs and independently calculated expected outputs, and implement the focused test runner `work/R50-T032/check.py`.

---

## Plan Summary & Expected Test Results (Before Any Code Changes)

### 1. Analysis of Current `decimalIsolate`

- **Current Implementation**:
  ```javascript
  /*
   * function isolates the decimal part of a number.
   * Take the number and subtract it from the floored number.
   * Return the result.
   */
  export const decimalIsolate = (number) => {
    const answer = parseFloat((number + '').replace(/^[-\d]+./, '.'))
    return isNaN(answer) === true ? 0 : answer
  }
  ```
- **Public Inputs**: `number` (numeric value or coercible to string).
- **Current Results**:
  - For standard floating-point numbers with integer and decimal fraction: e.g. `12.34` -> `0.34`, `-1.2` -> `0.2`, `0.5` -> `0.5`.
  - For `1`: regex `/^[-\d]+./` fails to match because `.` was intended as literal dot `\.` but was written as any character `.`. String `'1'` has length 1, so `^[-\d]+.` requires at least two characters. As a result, `'1'` is unchanged, yielding `parseFloat('1') = 1` (a clear bug).
  - For integers of length $\ge 2$ (e.g. `10`): `'10'` matches `^[-\d]+.`, replaced by `'.'`, `parseFloat('.')` -> `NaN`, which returns `0`.
  - For inputs without fractional part: integer values should have decimal fraction `0`.
  - For inputs outside standard decimal representation (e.g. exponential notation `< 1e-6` such as `1e-7`, or `>= 1e21`): string representation has no decimal point or has exponents.
- **Mutation Behavior**: Pure function, no state mutation.
- **External Dependencies**: Standard JavaScript built-ins (`parseFloat`, `isNaN`, string coercion).

### 2. Input Partitioning

- **Valid Interior**:
  - Real numbers in standard fixed-point representation with non-zero fractional digits.
  - Examples: `12.34` (expected `0.34`), `-1.2` (expected `0.2`), `0.5` (expected `0.5`).
- **Valid Boundary**:
  - Smallest supported positive input with decimal fraction: `0.000001` ($10^{-6}$, the smallest magnitude before JavaScript `toString()` converts to exponential notation `"1e-7"`). Expected output: `0.000001`.
  - Negative counterpart: `-0.000001` -> expected `0.000001`.
  - Smallest fractional offset from integer: `1.000001` -> expected `0.000001`.
  - Integer boundaries (zero fractional part): `0` -> expected `0`, `1` -> expected `0`, `10` -> expected `0`.
- **Explicitly Unsupported (Beyond Boundary)**:
  - Outside fixed-point decimal format (exponential notation): `1e-7` ($10^{-7}$, where `(1e-7 + '')` is `"1e-7"`), `1e21`.
  - Non-numeric or non-finite inputs: `NaN`, `Infinity`.
  - No arbitrary exceptions (`TypeError` / `RangeError`) will be added; safely returns fallback `0`.

### 3. Planned Test Matrix (Literal Inputs & Independently Calculated Expected Outputs)

- Valid Interior:
  - `decimalIsolate(12.34)` -> `0.34` (Precondition: line 2, line 8)
  - `decimalIsolate(-1.2)` -> `0.2` (Precondition: line 2, line 8)
  - `decimalIsolate(0.5)` -> `0.5` (Precondition: line 2, line 8)
- Valid Boundary:
  - `decimalIsolate(0.000001)` -> `0.000001` (Precondition: line 8, smallest standard decimal representation)
  - `decimalIsolate(-0.000001)` -> `0.000001` (Precondition: line 8)
  - `decimalIsolate(1.000001)` -> `0.000001` (Precondition: line 8)
  - `decimalIsolate(0)` -> `0` (Precondition: line 2, line 9)
  - `decimalIsolate(1)` -> `0` (Precondition: line 2, line 9)
  - `decimalIsolate(10)` -> `0` (Precondition: line 2, line 9)
- Explicitly Unsupported:
  - `decimalIsolate(1e-7)` -> `0` (Precondition: line 8, line 9)
  - `decimalIsolate(1e21)` -> `0` (Precondition: line 8, line 9)

**Expected Results Before Implementation Fix**:

- Test for `decimalIsolate(1)` is expected to fail with `received 1, expected 0`.
- All other tests expected to pass or reveal regex behavior.

---

## Step-by-Step Progress Updates

### Step 1: Analysis & Documentation

- Read `Maths/DecimalIsolate.js` (lines 1-10).
- Recorded inputs, results, mutation behavior, and dependencies in plan above.
- Status: Completed.

### Step 2: Partitioning

- Categorized into Valid Interior, Valid Boundary, and Explicitly Unsupported in plan above.
- Status: Completed.

### Step 3: Test-Driven Preparation

- Created tests in `Maths/test/DecimalIsolate.test.js` before modifying implementation.
- Tested smallest valid input (`0.000001`), negative counterpart (`-0.000001`), ordinary input (`12.34`), and integer boundaries (`0`, `1`, `10`).
- Each check cited lines 2, 8, 9 establishing preconditions.
- Status: Completed.

### Step 4: Runner Implementation & Initial Verification (Failure Propagation)

- Created `work/R50-T032/check.py` (and mirrored in `TheAlgorithms-JavaScript/work/R50-T032/check.py`).
- Executed `python3 work/R50-T032/check.py`.
- Result:
  - Installed lockfile via `npm ci` cleanly.
  - Focused test suite executed: 11 tests total (1 failed, 10 passed).
  - Failed assertion: `returns 0 for single-digit integer 1` (received 1, expected 0).
  - Script exited non-zero (exit code 1), confirming failure propagation.
- Status: Completed.

---

### Step 5: Implementation Update & Verification

- Updated `Maths/DecimalIsolate.js` with explicit contract documentation and logic:
  - Documented supported domain: standard fixed-point decimal format (magnitudes between $10^{-6}$ and $10^{21}$).
  - Smallest supported positive input with decimal fraction: `0.000001` ($10^{-6}$).
  - Returns `0` when input has no fractional part or is outside supported domain.
  - Added `!str.includes('.')` check and fixed regex `/^[-\d]+\./`.
- Executed `python3 work/R50-T032/check.py`:
  - **Focused Boundary Tests**: 11 passed (11 tests across 1 test file) in ~89ms.
  - **Full Repository Tests**: 11,981 passed (11,981 tests across 347 test files).
  - Exit code: 0.
- Ran `npx prettier WORK_LOG.md --write` and verified `npm run check-style` passed cleanly with 0 formatting errors.
- Status: Completed.

### Step 6: Documentation & Style Verification

- JSDoc is present and adheres to repository conventions on `decimalIsolate`.
- Code style adheres strictly to Prettier formatting configured in repository.
- Status: Completed.
