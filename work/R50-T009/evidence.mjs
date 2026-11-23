// R50-T009 evidence: correctness fixture, exact call counts, and timings for
// the recursive fibonacci. Prints JSON rows; also writes timings.json.
//
// - Input size: n, the index passed to fibonacci.
// - Operation count: number of calls. Counted in an in-memory copy of the
//   real source with a counter added on the first line of the function body;
//   the source file itself is not changed.
// - Timings: performance.now() around the call only (after a warm-up call),
//   so process startup, module loading, I/O and JIT compilation are outside
//   the timed interval. No pass/fail decision uses a timing.
import { readFileSync, writeFileSync } from 'fs'
import { performance } from 'perf_hooks'
import { fibonacci } from '../../Recursive/FibonacciNumberRecursive.js'

const SRC = 'FibonacciNumberRecursive.js'
const here = new URL('.', import.meta.url)

// Independent oracle: iterative, O(n), does not call fibonacci.
const iterative = (n) => {
  let [a, b] = [0, 1]
  for (let i = 0; i < n; i++) [a, b] = [b, a + b]
  return a
}

const rows = [
  [0, 0],
  [1, 1],
  [2, 1],
  [5, 5],
  [10, 55]
].map(([n, expected]) => {
  const actual = fibonacci(n)
  return {
    name: `fibonacci(${n})`,
    input: n,
    expected,
    actual,
    pass: actual === expected,
    precondition: `${SRC}:8 zero-based indexing; :20-21 base case n < 2`
  }
})

// Instrumented copy for call counting.
const source = readFileSync(
  new URL('../../Recursive/FibonacciNumberRecursive.js', import.meta.url),
  'utf8'
)
const marker = 'const fibonacci = (n) => {'
if (!source.includes(marker)) throw new Error('function header not found')
const instrumented =
  'let calls = 0\nconst resetCalls = () => { calls = 0 }\nconst getCalls = () => calls\n' +
  source.replace(marker, `${marker}\n  calls++`) +
  '\nexport { resetCalls, getCalls }\n'
const counted = await import(
  'data:text/javascript,' + encodeURIComponent(instrumented)
)

const sizes = [20, 24, 28]
const REPS = 5
const experiment = []
for (const n of sizes) {
  // Exact call count (deterministic).
  counted.resetCalls()
  counted.fibonacci(n)
  const calls = counted.getCalls()
  const predictedCalls = 2 * iterative(n + 1) - 1

  // Timings of the real, uninstrumented function.
  fibonacci(n) // warm-up so compilation is not timed
  const times = []
  const results = []
  for (let r = 0; r < REPS; r++) {
    const t0 = performance.now()
    const value = fibonacci(n)
    times.push(performance.now() - t0)
    results.push(value) // checked below, outside the timed interval
  }
  const sorted = [...times].sort((a, b) => a - b)
  const expectedValue = iterative(n)
  experiment.push({
    n,
    calls,
    predictedCalls,
    medianMs: +sorted[2].toFixed(3),
    rangeMs: [+sorted[0].toFixed(3), +sorted[REPS - 1].toFixed(3)],
    allResultsCorrect: results.every((v) => v === expectedValue)
  })
  rows.push({
    name: `n = ${n}: value and exact call count`,
    input: n,
    expected: { value: expectedValue, calls: predictedCalls },
    actual: { value: results[0], calls },
    pass: results.every((v) => v === expectedValue) && calls === predictedCalls,
    precondition: `${SRC}:23 two recursive calls per n >= 2`
  })
}

const ratios = experiment.slice(1).map((e, i) => ({
  from: experiment[i].n,
  to: e.n,
  callRatio: +(e.calls / experiment[i].calls).toFixed(3),
  medianTimeRatio: +(e.medianMs / experiment[i].medianMs).toFixed(2)
}))
writeFileSync(
  new URL('timings.json', here),
  JSON.stringify(
    {
      note: 'Observations only; no threshold is applied to timings.',
      phiToThe4th: +(((1 + Math.sqrt(5)) / 2) ** 4).toFixed(3),
      repetitions: REPS,
      experiment,
      ratios
    },
    null,
    2
  ) + '\n'
)

console.log(JSON.stringify(rows))
