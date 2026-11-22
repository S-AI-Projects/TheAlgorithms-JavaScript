import { ReverseSinglyLinkedList } from '../ReverseSinglyLinkedList'
import { Node } from '../SinglyLinkedList'

describe('ReverseSinglyLinkedList', () => {
  it('Reverse a Number Represented as Linked List', () => {
    const headNode = new Node(3)
    headNode.next = new Node(4)
    headNode.next.next = new Node(1)
    const expected = new Node(1)
    expected.next = new Node(4)
    expected.next.next = new Node(3)
    const reverseSinglyLinkedList = new ReverseSinglyLinkedList()
    expect(reverseSinglyLinkedList.solution(headNode)).toEqual(expected)
  })

  it('Stated Fixture: three distinct nodes A->B->C tests values, node links, and mutation separately', () => {
    // 1. Construct three distinct nodes A -> B -> C
    const nodeA = new Node('A')
    const nodeB = new Node('B')
    const nodeC = new Node('C')
    nodeA.next = nodeB
    nodeB.next = nodeC

    const reverser = new ReverseSinglyLinkedList()
    const returnedHead = reverser.solution(nodeA)

    // Check returned head is nodeC by reference
    expect(returnedHead).toBe(nodeC)

    // Check node links separately so a value-only comparison cannot hide a broken link
    expect(returnedHead.next).toBe(nodeB)
    expect(returnedHead.next.next).toBe(nodeA)
    expect(returnedHead.next.next.next).toBeNull()

    // Check values along the links separately
    expect(returnedHead.data).toBe('C')
    expect(returnedHead.next.data).toBe('B')
    expect(returnedHead.next.next.data).toBe('A')

    // Check observable mutation on the original node references separately
    expect(nodeA.next).toBeNull()
    expect(nodeA.data).toBe('A')
    expect(nodeB.next).toBe(nodeA)
    expect(nodeB.data).toBe('B')
    expect(nodeC.next).toBe(nodeB)
    expect(nodeC.data).toBe('C')
  })

  it('Smallest supported list: handles null (empty list)', () => {
    const reverser = new ReverseSinglyLinkedList()
    const result = reverser.solution(null)
    expect(result).toBeNull()
  })

  it('Smallest supported list: handles single-node list', () => {
    const singleNode = new Node('single')
    const reverser = new ReverseSinglyLinkedList()
    const result = reverser.solution(singleNode)

    // Returned head reference
    expect(result).toBe(singleNode)
    // Value and link verification
    expect(result.data).toBe('single')
    expect(result.next).toBeNull()
    // Mutation verification
    expect(singleNode.data).toBe('single')
    expect(singleNode.next).toBeNull()
  })

  it('Repeated-value domain boundary: maintains node link integrity and identity with duplicate values', () => {
    const node1 = new Node('dup')
    const node2 = new Node('dup')
    const node3 = new Node('dup')
    node1.next = node2
    node2.next = node3

    const reverser = new ReverseSinglyLinkedList()
    const result = reverser.solution(node1)

    // Identity / link check (distinct objects even though values are identical)
    expect(result).toBe(node3)
    expect(result.next).toBe(node2)
    expect(result.next.next).toBe(node1)
    expect(result.next.next.next).toBeNull()

    // Values verification
    expect(result.data).toBe('dup')
    expect(result.next.data).toBe('dup')
    expect(result.next.next.data).toBe('dup')

    // Mutation verification
    expect(node1.next).toBeNull()
    expect(node2.next).toBe(node1)
    expect(node3.next).toBe(node2)
  })

  it('Ordinary input: reverses multi-element numeric list', () => {
    const n1 = new Node(10)
    const n2 = new Node(20)
    const n3 = new Node(30)
    const n4 = new Node(40)
    n1.next = n2
    n2.next = n3
    n3.next = n4

    const reverser = new ReverseSinglyLinkedList()
    const result = reverser.solution(n1)

    expect(result).toBe(n4)
    expect(result.next).toBe(n3)
    expect(result.next.next).toBe(n2)
    expect(result.next.next.next).toBe(n1)
    expect(result.next.next.next.next).toBeNull()

    expect(result.data).toBe(40)
    expect(result.next.data).toBe(30)
    expect(result.next.next.data).toBe(20)
    expect(result.next.next.next.data).toBe(10)
  })
})
