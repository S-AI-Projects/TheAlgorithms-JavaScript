import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import assert from 'node:assert/strict'

const sourcePath = path.resolve('Recursive/PalindromePartitioning.js')
const source = fs.readFileSync(sourcePath, 'utf8')
const mutant = source.replace('i < s.length; i++', 'i < s.length - 1; i++')
if (mutant === source) throw new Error('Mutation target was not found')
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'palindrome-mutant-'))
try {
  const mutantPath = path.join(directory, 'PalindromePartitioning.mutant.mjs')
  const palindromePath = path.resolve('Recursive/Palindrome.js')
  const importText = mutant.replace(
    "import { palindrome } from './Palindrome'",
    `import { palindrome } from '${pathToFileURL(palindromePath).href}'`
  )
  fs.writeFileSync(mutantPath, importText)
  const { default: mutantPartition } = await import(
    pathToFileURL(mutantPath).href
  )
  try {
    assert.deepStrictEqual(mutantPartition('a'), [['a']])
    throw new Error(
      'Mutation survived: single character returns one palindrome partition'
    )
  } catch (error) {
    if (error.message.startsWith('Mutation survived:')) throw error
    if (error.code !== 'ERR_ASSERTION') throw error
    if (
      !error.message.includes(
        'single character returns one palindrome partition'
      )
    ) {
      console.log(
        'Mutation detected by the same assertion: single character returns one palindrome partition.'
      )
    }
  }
} finally {
  fs.rmSync(directory, { recursive: true, force: true })
}
