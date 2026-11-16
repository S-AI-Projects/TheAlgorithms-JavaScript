# WORK_LOG.md: Task R50-T035 (Geometry/Circle.js)

## Task Information

- **Student**: ANIKET KUMAR NISHAD
- **Task**: R50-T035 · 5 of 10
- **Issue**: https://github.com/S-AI-Projects/TheAlgorithms-JavaScript/issues/35
- **Repository**: https://github.com/S-AI-Projects/TheAlgorithms-JavaScript
- **Assigned working branch**: `student/e26b07f0789`
- **Target File**: `Geometry/Circle.js` (`Circle` near line 1)

---

## Tool Versions

- **Node.js**: `v24.19.0`
- **npm**: `11.17.0`
- **Python**: `3.15.2`
- **Vitest**: `v1.2.1`

---

## 1. Analysis (Step 1)

- **Target Class**: `Circle` in `Geometry/Circle.js`
- **Public Inputs**:
  - `constructor(radius)`: `radius` (`number`, non-negative geometric radius).
  - `perimeter()`: takes no parameters.
  - `area()`: takes no parameters.
- **Results**:
  - `perimeter()`: returns $2 \cdot \pi \cdot r$ (`number`, finite non-negative).
  - `area()`: returns $\pi \cdot r^2$ (`number`, finite non-negative).
- **Mutation Behavior**:
  - Pure class: does not mutate inputs, internal state post-initialization, prototype, or global state.
- **External Dependencies**:
  - JavaScript built-ins: `Math.PI`, `Math.pow`.
  - **Observable Dependencies**: None (no time, randomness, network, filesystem, or UI dependencies).

---

## 2. Invariants & Fixtures (Step 2 & 3)

### Documented Invariants

1. **Output Type and Shape Invariant**: Both `area()` and `perimeter()` return finite JavaScript numbers $\ge 0$.
2. **Deterministic & Pure**: Repeated calls on the same instance or fresh equivalent instances yield identical values without side effects.
3. **Input Isolation**: Running interleaved executions on separate instances with different inputs (e.g., $r = 25$) does not mutate existing instances ($r = 10$) or alter subsequent computations.

### Fixtures & Preconditions

- **Smallest Valid Input**:
  - Input: `radius = 0`
  - Independently calculated expected outputs:
    - `area()`: $0^2 \cdot \pi = 0$
    - `perimeter()`: $2 \cdot 0 \cdot \pi = 0$
  - Preconditions: `Geometry/Circle.js` line 15 (`this.radius = radius`), lines 19, 23.
- **Representative Ordinary Input**:
  - Input: `radius = 10`
  - Independently calculated expected outputs:
    - `area()`: $10^2 \cdot \pi = 100 \cdot \pi \approx 314.1592653589793$
    - `perimeter()`: $2 \cdot 10 \cdot \pi = 20 \cdot \pi \approx 62.83185307179586$
  - Preconditions: `Geometry/Circle.js` lines 15, 19, 23.
- **Repeatability & Input Isolation Validation**:
  - Run 1: Fresh instance `circleA = new Circle(10)` -> $area \approx 314.1592653589793$.
  - Run 2: Fresh instance `circleB = new Circle(10)` -> exact equality to Run 1.
  - Interleaved Run: `interleaved = new Circle(25)` -> $area \approx 1963.4954084936207$.
  - Run 3: Fresh instance `circleC = new Circle(10)` -> exact equality to Run 1.
  - Instance Non-Mutation: `circleA.radius === 10` and results remain identical to Run 1.

---

## 3. Test Runner & Verification (Step 4 & 5)

- **Runner Script**: `work/R50-T035/check.py`
- **Execution Command**: `python3 work/R50-T035/check.py`
- **Execution Output Summary**:
  - Focused Suite: `npx vitest run Geometry/Test/Circle.test.js` -> 5 tests passed (all assertions passed).
  - Deliberate Invariant Mutation Check: Mutated `this.radius * 2 * Math.PI` to `this.radius * 3 * Math.PI` in a temporary copy -> failed as expected with non-zero exit code.
  - Full Repository Test Suite (Non-watch): `npm test` -> 347 test files passed, 12,012 tests passed.
  - Code Style Formatting: Passed Prettier check (`npm run check-style`).

---

## 4. Documentation & PR Preparation (Step 6)

- Added JSDoc in `Geometry/Circle.js` detailing class behavior, invariants, and input expectations.
- Prettier style verified across all modified files.
- Maintained task evidence inside `work/R50-T035/`.
