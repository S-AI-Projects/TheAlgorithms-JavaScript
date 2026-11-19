import { performance } from 'node:perf_hooks'
import { findUniqueElement } from '../../Bit-Manipulation/UniqueElementInAnArray.js'

const sizes = [10001, 50001, 100001]
const repetitions = 5
const results = []

for (const size of sizes) {
  const input = Array.from({ length: size - 1 }, (_, index) => index % 1000)
  input.push(987654321)
  const expected = 987654321
  const samples = []
  for (let repetition = 0; repetition < repetitions; repetition++) {
    const freshInput = [...input]
    const start = performance.now()
    const actual = findUniqueElement(freshInput)
    samples.push(performance.now() - start)
    if (actual !== expected) throw new Error(`Incorrect result for n=${size}`)
  }
  const ordered = [...samples].sort((a, b) => a - b)
  results.push({
    size,
    medianMs: ordered[2],
    minMs: ordered[0],
    maxMs: ordered[4],
    expected
  })
}

console.log(JSON.stringify({ repetitions, results }, null, 2))
