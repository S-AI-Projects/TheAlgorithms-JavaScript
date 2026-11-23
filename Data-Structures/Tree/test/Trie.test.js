import { Trie, TrieNode } from '../Trie'

// Fixture: insert "car", "cat" and "dog".
const buildTrie = () => {
  const trie = new Trie()
  trie.insert('car')
  trie.insert('cat')
  trie.insert('dog')
  return trie
}

describe('TrieNode', () => {
  // Trie.js lines 21-22: an omitted parent becomes null.
  it('a node created without a parent has parent null and count 0', () => {
    const node = new TrieNode('c')
    expect(node.key).toBe('c')
    expect(node.parent).toBeNull()
    expect(node.count).toBe(0)
    expect(Object.keys(node.children)).toEqual([])
  })

  it('a child node keeps a reference to its parent', () => {
    const root = new TrieNode(null, null)
    const child = new TrieNode('c', root)
    expect(child.parent).toBe(root)
  })
})

describe('Trie absent-result paths (no exceptions are thrown)', () => {
  // Branch under test: findPrefix returns null at Trie.js line 76
  // ("No such prefix exists") when a character has no child node.
  it("missing word 'cab' reaches the null branch of findPrefix", () => {
    const trie = buildTrie()
    // 'c' and 'a' exist, 'b' does not: the loop stops at i = 2.
    expect(trie.findPrefix('ca')).toBeInstanceOf(TrieNode)
    expect(trie.findPrefix('cab')).toBeNull()
    expect(trie.contains('cab')).toBe(false) // line 135
    expect(trie.findOccurrences('cab')).toBe(0) // line 142
    expect(trie.findAllWords('cab')).toEqual([]) // line 126
  })

  // Branch under test: node exists but count is 0 (Trie.js line 135).
  it("prefix 'ca' is not a complete word, but 'car' is", () => {
    const trie = buildTrie()
    const prefixNode = trie.findPrefix('ca')
    expect(prefixNode.count).toBe(0)
    expect(trie.contains('ca')).toBe(false)
    expect(trie.findOccurrences('ca')).toBe(0)
    expect(trie.contains('car')).toBe(true)
    expect(trie.findOccurrences('car')).toBe(1)
  })

  it('non-string input is ignored, not thrown (lines 52 and 70)', () => {
    const trie = buildTrie()
    expect(trie.insert(5)).toBeUndefined()
    expect(trie.findPrefix(5)).toBeNull()
    expect(trie.findAllWords('')).toEqual([
      { word: 'car', count: 1 },
      { word: 'cat', count: 1 },
      { word: 'dog', count: 1 }
    ])
  })

  it('failed lookups leave the trie unchanged and later calls succeed', () => {
    const trie = buildTrie()

    expect(trie.contains('cab')).toBe(false)
    expect(trie.findPrefix('zebra')).toBeNull()
    expect(trie.findAllWords('')).toEqual([
      { word: 'car', count: 1 },
      { word: 'cat', count: 1 },
      { word: 'dog', count: 1 }
    ])
    expect(trie.findPrefix('cab')).toBeNull() // no node was created

    // An ordinary valid call after the failure.
    trie.insert('cab')
    expect(trie.contains('cab')).toBe(true)
    expect(trie.findOccurrences('cab')).toBe(1)
    expect(trie.contains('car')).toBe(true)
  })

  it('repeated insertion increments the count of the same node', () => {
    const trie = buildTrie()
    const node = trie.findPrefix('car')
    trie.insert('car')
    expect(trie.findPrefix('car')).toBe(node)
    expect(trie.findOccurrences('car')).toBe(2)
    expect(trie.findAllWords('ca')).toEqual([
      { word: 'car', count: 2 },
      { word: 'cat', count: 1 }
    ])
  })
})
