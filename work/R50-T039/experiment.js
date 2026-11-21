import { liouvilleFunction } from '../../Maths/LiouvilleFunction.js'
import { PrimeFactors } from '../../Maths/PrimeFactors.js'

// Simple deterministic PRNG (Mulberry32)
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Benchmark sizes:
// Size 1 (Small): n in [100, 1_000]
// Size 2 (Medium): n in [10_000, 100_000]
// Size 3 (Large): n in [1_000_000, 10_000_000]
const sizes = [
  { name: 'Small (10^2 - 10^3)', min: 100, max: 1000 },
  { name: 'Medium (10^4 - 10^5)', min: 10000, max: 100000 },
  { name: 'Large (10^6 - 10^7)', min: 1000000, max: 10000000 }
]

const repetitions = 5
const itersPerRep = 500
const prng = mulberry32(42)

console.log('=== LiouvilleFunction Complexity & Scaling Experiment ===\n')

const results = []

for (const size of sizes) {
  // Generate inputs with fixed seed
  const inputs = []
  for (let r = 0; r < repetitions; r++) {
    const repInputs = []
    for (let i = 0; i < itersPerRep; i++) {
      const val = Math.floor(prng() * (size.max - size.min + 1)) + size.min
      repInputs.push(val)
    }
    inputs.push(repInputs)
  }

  // Check correctness outside timed interval
  for (const repInputs of inputs) {
    for (const val of repInputs) {
      const res = liouvilleFunction(val)
      const expected = PrimeFactors(val).length % 2 === 0 ? 1 : -1
      if (res !== expected) {
        throw new Error(
          `Correctness mismatch for ${val}: got ${res}, expected ${expected}`
        )
      }
    }
  }

  // Measure timing across 5 repetitions
  const times = []
  for (let r = 0; r < repetitions; r++) {
    const repInputs = inputs[r]
    const t0 = performance.now()
    for (let i = 0; i < itersPerRep; i++) {
      liouvilleFunction(repInputs[i])
    }
    const t1 = performance.now()
    times.push(t1 - t0)
  }

  times.sort((a, b) => a - b)
  const median = times[Math.floor(repetitions / 2)]
  const min = times[0]
  const max = times[repetitions - 1]
  const range = max - min

  results.push({ size: size.name, median, min, max, range, raw: times })
  console.log(`${size.name}:`)
  console.log(
    `  Repetitions: ${times.map((t) => t.toFixed(3) + 'ms').join(', ')}`
  )
  console.log(
    `  Median: ${median.toFixed(3)}ms, Range: ${range.toFixed(
      3
    )}ms (Min: ${min.toFixed(3)}ms, Max: ${max.toFixed(3)}ms)\n`
  )
}
