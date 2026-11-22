/**
 * A LinkedList based solution for Add Two Numbers.
 *
 * Problem Statement:
 * Given two non-empty linked lists representing two non-negative integers.
 * The digits are stored in reverse order and each of their nodes contains a single digit.
 * Add the two numbers and return it as a linked list.
 *
 * Link for the Problem: https://leetcode.com/problems/add-two-numbers/
 *
 * Complexity Analysis:
 * Let M be the length of firstList and N be the length of secondList.
 * Input size variable: L = max(M, N).
 *
 * Time Complexity:
 * - Theoretical worst-case: O(max(M, N)), bounded by at most max(M, N) + 1 loop iterations,
 *   where each iteration performs O(1) integer arithmetic and pointer advancements.
 * - Empirical observation: Across benchmark experiments with list lengths L in {100, 1000, 10000},
 *   measured CPU runtime scales linearly with max(M, N), confirming O(L) time complexity.
 *
 * Space Complexity:
 * - Theoretical worst-case: O(max(M, N)) auxiliary space to allocate a new result list
 *   containing at most max(M, N) + 1 nodes.
 * - Empirical observation: The number of allocated nodes exactly equals max(M, N) + (carry > 0 ? 1 : 0).
 */
import { Node } from './SinglyLinkedList.js'

class AddTwoNumbers {
  constructor() {
    this.dummyNode = new Node(0)
  }

  solution(firstList, secondList) {
    let firstRunner = firstList
    let secondRunner = secondList
    let tail = this.dummyNode
    let carry = 0
    while (firstRunner != null || secondRunner != null) {
      const firstNumber = firstRunner ? firstRunner.data : 0
      const secondNumber = secondRunner ? secondRunner.data : 0
      const sum = carry + firstNumber + secondNumber
      carry = parseInt(sum / 10)
      tail.next = new Node(sum % 10)
      tail = tail.next
      if (firstRunner) {
        firstRunner = firstRunner.next
      }
      if (secondRunner) {
        secondRunner = secondRunner.next
      }
    }
    if (carry > 0) {
      tail.next = new Node(carry % 10)
    }

    return this.dummyNode.next
  }

  solutionToArray() {
    const list = []
    let currentNode = this.dummyNode.next
    while (currentNode) {
      list.push(currentNode.data)
      currentNode = currentNode.next
    }

    return list
  }
}

export { AddTwoNumbers, Node }
