/**
 * A LinkedList based solution to reverse a singly linked list.
 *
 * Input/Output Contract:
 * - Public Inputs:
 *   - `head` {Node|null}: The head node of a singly linked list. Each node must have a `data` value and a `next` reference ({Node|null}).
 * - Result:
 *   - {Node|null}: The head of the reversed singly linked list (the original tail node), or `null` if the input list is null.
 * - Mutation Behavior:
 *   - Mutates `next` pointers in-place to reverse link directions. Does not mutate the `data` properties of nodes.
 * - External Dependencies:
 *   - Operates on standard singly-linked list node structures with `.data` and `.next`.
 * - Complexity:
 *   - Time: O(n) where n is the number of nodes in the list.
 *   - Space: O(1) auxiliary space (in-place pointer reversal).
 *
 * Problem Statement:
 * Given a singly linked list, reverse the list and return the head of the reversed linked list.
 * Link for the Problem: https://leetcode.com/problems/reverse-linked-list/
 */
class ReverseSinglyLinkedList {
  /**
   * Reverses a singly linked list in-place.
   * @param {Node|null} head - Head of the singly linked list.
   * @returns {Node|null} - Head of the reversed list.
   */
  solution(head) {
    let prev = null
    let next = null
    while (head) {
      next = head.next
      head.next = prev
      prev = head
      head = next
    }
    return prev
  }
}

export { ReverseSinglyLinkedList }
