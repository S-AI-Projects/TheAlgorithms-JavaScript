import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const sourcePath = path.resolve('Sorts/SimplifiedWiggleSort.js')
const source = fs.readFileSync(sourcePath, 'utf8')
const mutant = source.replace('return result', 'return result.slice(1)')
if (mutant === source) throw new Error('Mutation target was not found')

const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'wiggle-mutant-'))
try {
  const mutantPath = path.join(directory, 'SimplifiedWiggleSort.mutant.mjs')
  fs.writeFileSync(mutantPath, mutant)
  const { simplifiedWiggleSort } = await import(pathToFileURL(mutantPath).href)
  const input = [3, 1, 2]
  const original = [3, 1, 2]
  const output = simplifiedWiggleSort(input)
  const expectedMultiset = [...original].sort((a, b) => a - b)
  const actualMultiset = [...output].sort((a, b) => a - b)

  try {
    assert.deepStrictEqual(actualMultiset, expectedMultiset)
    throw new Error('Mutation survived: preserves the input multiset')
  } catch (error) {
    if (error.message.startsWith('Mutation survived:')) throw error
    if (error.code !== 'ERR_ASSERTION') throw error
    console.log('Mutation detected: preserves the input multiset.')
  }
} finally {
  fs.rmSync(directory, { recursive: true, force: true })
}
