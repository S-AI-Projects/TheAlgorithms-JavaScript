# WORK_LOG.md: Task R50-T039 (Maths/LiouvilleFunction.js)

## Task Information

- **Student**: ANIKET KUMAR NISHAD
- **Task**: R50-T039 · 9 of 10
- **Issue**: https://github.com/S-AI-Projects/TheAlgorithms-JavaScript/issues/39
- **Repository**: https://github.com/S-AI-Projects/TheAlgorithms-JavaScript
- **Assigned working branch**: `student/e26b07f0789`
- **Target File**: `Maths/LiouvilleFunction.js` (`liouvilleFunction` near line 20)

---

## Tool Versions

- **Node.js**: `v24.19.0`
- **npm**: `11.17.0`
- **Python**: `3.15.2`
- **Vitest**: `v1.2.1`

---

## 1. Analysis (Step 1)

- **Target Function**: `liouvilleFunction(number)` in `Maths/LiouvilleFunction.js`
- **Public Inputs**:
  - `number`: Positive integer ($n \in \mathbb{Z}^+$).
- **Results**:
  - `1`: if the total number of prime factors (counted with multiplicity) $\Omega(n)$ is even ($(-1)^{\Omega(n)} = 1$).
  - `-1`: if the total number of prime factors is odd ($(-1)^{\Omega(n)} = -1$).
  - Throws `Error('Number must be greater than zero.')` when `number <= 0`.
- **Mutation Behavior**:
  - Pure function; zero mutations of caller-owned state or arguments.
- **External Dependencies**:
  - `PrimeFactors(n)` from `./PrimeFactors.js`.

---

## 2. Complexity Experiment & Analysis (Step 2 & 3)

### Input Size Variable & Theoretical Claims

- **Input-Size Variable**: $n$ (the integer magnitude passed to `liouvilleFunction`).
- **Theoretical Worst-Case Time Complexity**: $\mathcal{O}(\sqrt{n})$.
  - `PrimeFactors(n)` uses trial division up to $\lfloor\sqrt{n}\rfloor$ (loop `i * i <= n`).
  - The worst case occurs when $n$ is prime, requiring checking all integers up to $\sqrt{n}$.
- **Theoretical Best-Case Time Complexity**: $\mathcal{O}(\log n)$ (e.g. $n = 2^k$, quickly reduced to 1).
- **Auxiliary Space Complexity**: $\mathcal{O}(\log n)$ for holding the factor array.

### Empirical Scaling Experiment Results

Benchmark executed with fixed PRNG seed (`42`, Mulberry32), 5 repetitions per size tier, 500 iterations per repetition, with all outputs verified outside the timed interval:

1. **Small ($10^2 - 10^3$)**:
   - Repetitions: `0.027ms, 0.030ms, 0.031ms, 0.032ms, 0.157ms`
   - **Median**: `0.031ms` (Range: `0.130ms`, Min: `0.027ms`, Max: `0.157ms`)
2. **Medium ($10^4 - 10^5$)**:
   - Repetitions: `0.048ms, 0.050ms, 0.051ms, 0.052ms, 0.054ms`
   - **Median**: `0.051ms` (Range: `0.006ms`, Min: `0.048ms`, Max: `0.054ms`)
3. **Large ($10^6 - 10^7$)**:
   - Repetitions: `0.197ms, 0.200ms, 0.207ms, 0.208ms, 0.221ms`
   - **Median**: `0.207ms` (Range: `0.024ms`, Min: `0.197ms`, Max: `0.221ms`)

The empirical observations confirm sub-linear $\mathcal{O}(\sqrt{n})$ scaling.

---

## 3. Fixtures & Invariants (Step 2 & 3)

- **Smallest Valid Input**:
  - Input: `1`
  - Independently calculated expected output: `1` ($1$ has 0 prime factors; $(-1)^0 = 1$)
  - Preconditions: `Maths/LiouvilleFunction.js` line 39 (`PrimeFactors(1)` returns `[]`, length 0 is even $\to 1$).
- **Representative Ordinary Input**:
  - Input: `12`
  - Independently calculated expected output: `-1` ($12 = 2 \times 2 \times 3$, 3 prime factors; $(-1)^3 = -1$)
  - Preconditions: `Maths/LiouvilleFunction.js` line 39.
- **Large Representative Scaling Input**:
  - Input: `1,000,000` $\to$ `1` ($10^6 = 2^6 \cdot 5^6$, 12 factors $\to$ even $\to 1$).
  - Input: `999,983` (prime) $\to$ `-1` (1 factor $\to$ odd $\to -1$).

---

## 4. Test Runner & Verification (Step 4 & 5)

- **Runner Script**: `work/R50-T039/check.py`
- **Execution Command**: `python3 work/R50-T039/check.py`
- **Execution Output Summary**:
  - Lockfile check: passed.
  - Focused Suite: `npx vitest run Maths/test/LiouvilleFunction.test.js` -> 106 tests passed.
  - Complexity Experiment: `node work/R50-T039/experiment.js` -> completed successfully.
  - Deliberate Mutation Check: Mutated parity check condition in a temporary copy -> failed as required with non-zero exit code.
  - Full Repository Test Suite (Non-watch): `npm test` -> 347 test files passed, 12,027 tests passed.
  - Prettier Code Style: Passed `npm run check-style`.

---

## 5. Documentation & PR Preparation (Step 6)

- Added comprehensive complexity comment in `Maths/LiouvilleFunction.js` documenting the input-size variable, theoretical bounds, and empirical scaling observations.
- Maintained task evidence inside `work/R50-T039/`.
