import { AddTwoNumbers } from '../AddTwoNumbers.js'
import { LinkedList, Node } from '../SinglyLinkedList'

describe('AddTwoNumbers', () => {
  it('Check Sum Of Two Linked List', () => {
    const list1 = new LinkedList()
    list1.addFirst(2)
    list1.addLast(4)
    list1.addLast(3)

    const list2 = new LinkedList()
    list2.addFirst(5)
    list2.addLast(6)
    list2.addLast(4)

    const expected = new LinkedList()
    expected.addFirst(7)
    expected.addLast(0)
    expected.addLast(8)

    const addTwoLinkedList = new AddTwoNumbers()
    addTwoLinkedList.solution(list1.headNode, list2.headNode)

    expect(addTwoLinkedList.solutionToArray()).toEqual(expected.get())
  })

  it('adds three distinct nodes A->B->C and smallest supported list with separate value and link checks', () => {
    // Construct three distinct nodes A -> B -> C: 2 -> 4 -> 3 (342)
    const nodeC = new Node(3)
    const nodeB = new Node(4)
    nodeB.next = nodeC
    const nodeA = new Node(2)
    nodeA.next = nodeB

    // Construct smallest supported list: single node S: 5
    const nodeS = new Node(5)

    const adder = new AddTwoNumbers()
    const resultHead = adder.solution(nodeA, nodeS)

    // Separate Link Checks (verifying pointer integrity without relying on values)
    expect(resultHead).not.toBeNull()
    expect(resultHead.next).not.toBeNull()
    expect(resultHead.next.next).not.toBeNull()
    expect(resultHead.next.next.next).toBeNull()

    // Separate Value Checks (342 + 5 = 347, in reverse order: 7 -> 4 -> 3)
    expect(resultHead.data).toBe(7)
    expect(resultHead.next.data).toBe(4)
    expect(resultHead.next.next.data).toBe(3)

    expect(adder.solutionToArray()).toEqual([7, 4, 3])
  })

  it('adds two smallest supported single-node lists with carry and checks link and values separately', () => {
    // 5 + 5 = 10 -> 0 -> 1
    const list1 = new Node(5)
    const list2 = new Node(5)

    const adder = new AddTwoNumbers()
    const resultHead = adder.solution(list1, list2)

    // Separate Link Checks
    expect(resultHead).not.toBeNull()
    expect(resultHead.next).not.toBeNull()
    expect(resultHead.next.next).toBeNull()

    // Separate Value Checks
    expect(resultHead.data).toBe(0)
    expect(resultHead.next.data).toBe(1)

    expect(adder.solutionToArray()).toEqual([0, 1])
  })

  it('handles carry propagation over three distinct nodes', () => {
    // 9 -> 9 -> 9 (999) + 1 = 1000 -> 0 -> 0 -> 0 -> 1
    const nodeC = new Node(9)
    const nodeB = new Node(9)
    nodeB.next = nodeC
    const nodeA = new Node(9)
    nodeA.next = nodeB

    const nodeS = new Node(1)

    const adder = new AddTwoNumbers()
    const resultHead = adder.solution(nodeA, nodeS)

    // Link integrity
    expect(resultHead).not.toBeNull()
    expect(resultHead.next).not.toBeNull()
    expect(resultHead.next.next).not.toBeNull()
    expect(resultHead.next.next.next).not.toBeNull()
    expect(resultHead.next.next.next.next).toBeNull()

    // Values
    expect(resultHead.data).toBe(0)
    expect(resultHead.next.data).toBe(0)
    expect(resultHead.next.next.data).toBe(0)
    expect(resultHead.next.next.next.data).toBe(1)

    expect(adder.solutionToArray()).toEqual([0, 0, 0, 1])
  })
})
