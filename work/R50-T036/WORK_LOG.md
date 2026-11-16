# WORK_LOG.md: Task R50-T036 (Maths/Coordinate.js)

## Task Information

- **Student**: ANIKET KUMAR NISHAD
- **Task**: R50-T036 · 6 of 10
- **Issue**: https://github.com/S-AI-Projects/TheAlgorithms-JavaScript/issues/36
- **Repository**: https://github.com/S-AI-Projects/TheAlgorithms-JavaScript
- **Assigned working branch**: `student/e26b07f0789`
- **Target File**: `Maths/Coordinate.js` (`euclideanDistance` near line 7)

---

## Tool Versions

- **Node.js**: `v24.19.0`
- **npm**: `11.17.0`
- **Python**: `3.15.2`
- **Vitest**: `v1.2.1`

---

## 1. Analysis (Step 1)

- **Target Function**: `euclideanDistance(longitude1, latitude1, longitude2, latitude2)` in `Maths/Coordinate.js`
- **Public Inputs**:
  - `longitude1`: Number ($x$-coordinate of first point)
  - `latitude1`: Number ($y$-coordinate of first point)
  - `longitude2`: Number ($x$-coordinate of second point)
  - `latitude2`: Number ($y$-coordinate of second point)
- **Results**:
  - Non-negative finite JavaScript number representing the 2D Euclidean distance: $\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.
  - Returns `NaN` when arguments are non-numeric or when fewer than 4 arguments are supplied.
- **Mutation Behavior**:
  - Pure function; does not mutate any arguments, objects, or external state.
- **External Dependencies**:
  - Standard JavaScript built-in `Math.hypot` (or `Math.sqrt`).
  - No external or observable side effects (no time, randomness, network, or UI).

---

## 2. Refactoring Responsibility & Invariants (Step 2 & 3)

### Identified Responsibility

- Calculation of coordinate displacement deltas $\Delta x$ and $\Delta y$:
  - Original naming used `width` and `height` with explicit manual squaring:
    `Math.sqrt(width * width + height * height)`
  - Refactored to standard Cartesian displacement terminology `dx` and `dy`, combining the calculation with standard ECMAScript `Math.hypot(dx, dy)`.
  - Preserves exact mathematical results, numeric types, non-mutation, and edge-case behavior (`NaN` handling).

### Documented Invariants

1. **Output Type and Shape**: Returns a finite non-negative number for valid numeric coordinates, and `NaN` for non-numeric/missing inputs.
2. **Deterministic & Pure**: Repeated calls with identical arguments yield identical results without side effects.
3. **Purity under Interleaved Execution**: Computations on intermediate inputs do not alter subsequent evaluations.

### Fixtures & Preconditions

- **Smallest Valid Input**:
  - Input: `(0, 0, 0, 0)` (coincident points at the origin)
  - Independently calculated expected output: $\sqrt{(0-0)^2 + (0-0)^2} = 0$
  - Preconditions: `Maths/Coordinate.js` lines 17-19 (`dx = 0`, `dy = 0`, `Math.hypot(0, 0) = 0`).
- **Representative Ordinary Input**:
  - Input: `(2, 2, 14, 11)` (classic 9-12-15 right triangle documented in the module)
  - Independently calculated expected output: $\Delta x = 12, \Delta y = 9, \sqrt{12^2 + 9^2} = \sqrt{225} = 15$
  - Preconditions: `Maths/Coordinate.js` lines 17-19.

---

## 3. Test Runner & Verification (Step 4 & 5)

- **Runner Script**: `work/R50-T036/check.py`
- **Execution Command**: `python3 work/R50-T036/check.py`
- **Execution Output Summary**:
  - Lockfile verification: ensured `node_modules` present.
  - Focused Suite: `npx vitest run Maths/test/Coordinate.test.js` -> 9 tests passed.
  - Deliberate Mutation Check: Mutated `Math.hypot(dx, dy)` to `Math.hypot(dx, dy) + 1` in a temporary copy -> failed as required with non-zero exit code.
  - Full Repository Test Suite (Non-watch): `npm test` -> 347 test files passed, 12,015 tests passed.
  - Prettier Code Style: Passed `npm run check-style`.

---

## 4. Documentation & PR Preparation (Step 6)

- Added JSDoc for `euclideanDistance` and `manhattanDistance` in `Maths/Coordinate.js`.
- Maintained task evidence inside `work/R50-T036/`.
