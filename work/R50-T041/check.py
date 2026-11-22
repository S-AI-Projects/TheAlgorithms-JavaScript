#!/usr/bin/env python3
"""
Automated check runner for Task R50-T041:
Lock down the contract of ReverseSinglyLinkedList (ReverseSinglyLinkedList.js)
"""

import json
import os
import subprocess
import sys
import time

def get_tool_versions(repo_root):
    env = os.environ.copy()
    if "/opt/homebrew/bin" not in env.get("PATH", ""):
        env["PATH"] = f"/opt/homebrew/bin:{env.get('PATH', '')}"

    def run_cmd(cmd):
        try:
            res = subprocess.run(cmd, shell=True, cwd=repo_root, capture_output=True, text=True, env=env)
            return res.stdout.strip()
        except Exception as e:
            return str(e)

    node_ver = run_cmd("node -v")
    npm_ver = run_cmd("npm -v")
    git_branch = run_cmd("git rev-parse --abbrev-ref HEAD")
    git_commit = run_cmd("git rev-parse HEAD")
    python_ver = sys.version.split()[0]

    return {
        "python": python_ver,
        "node": node_ver,
        "npm": npm_ver,
        "git_branch": git_branch,
        "git_commit": git_commit
    }

def run_native_tests(repo_root):
    env = os.environ.copy()
    if "/opt/homebrew/bin" not in env.get("PATH", ""):
        env["PATH"] = f"/opt/homebrew/bin:{env.get('PATH', '')}"

    cmd = "npm test -- Data-Structures/Linked-List/test/ReverseSinglyLinkedList.test.js"
    proc = subprocess.run(cmd, shell=True, cwd=repo_root, capture_output=True, text=True, env=env)

    output = proc.stdout + "\n" + proc.stderr
    passed = proc.returncode == 0

    # Parse test count from Vitest output
    test_count = 0
    for line in output.splitlines():
        if "Tests" in line and "passed" in line:
            parts = line.strip().split()
            for i, p in enumerate(parts):
                if p.isdigit():
                    test_count = int(p)
                    break

    return {
        "command": cmd,
        "exit_code": proc.returncode,
        "passed": passed,
        "test_count": test_count,
        "output": output
    }

def run_contract_regression_checks(repo_root):
    """
    Executes a Node script that runs the precise contract checks on
    ReverseSinglyLinkedList and outputs structured JSON results.
    """
    env = os.environ.copy()
    if "/opt/homebrew/bin" not in env.get("PATH", ""):
        env["PATH"] = f"/opt/homebrew/bin:{env.get('PATH', '')}"

    js_code = """
import { ReverseSinglyLinkedList } from './Data-Structures/Linked-List/ReverseSinglyLinkedList.js'
import { Node } from './Data-Structures/Linked-List/SinglyLinkedList.js'

const results = {
  checks: [],
  allPassed: true
}

function recordCheck(name, inputDesc, expected, actual, passed, details = {}) {
  results.checks.push({
    name,
    input: inputDesc,
    expected,
    actual,
    passed,
    details
  })
  if (!passed) {
    results.allPassed = false
  }
}

const reverser = new ReverseSinglyLinkedList()

// Check 1: Stated Fixture: Three distinct nodes A -> B -> C
try {
  const nodeA = new Node('A')
  const nodeB = new Node('B')
  const nodeC = new Node('C')
  nodeA.next = nodeB
  nodeB.next = nodeC

  const returnedHead = reverser.solution(nodeA)

  // 1a. Return value identity
  const returnedIsNodeC = returnedHead === nodeC
  recordCheck(
    'Stated Fixture: Return value identity',
    'A -> B -> C',
    'Returned head reference === Node C',
    returnedIsNodeC ? 'Returned head reference === Node C' : 'Head reference mismatch',
    returnedIsNodeC
  )

  // 1b. Node links checked separately
  const link1 = returnedHead.next === nodeB
  const link2 = returnedHead.next.next === nodeA
  const link3 = returnedHead.next.next.next === null
  const linksOk = link1 && link2 && link3
  recordCheck(
    'Stated Fixture: Node links separated from values',
    'nodeA -> nodeB -> nodeC',
    'C.next === B, B.next === A, A.next === null',
    `C.next: ${link1 ? 'B' : 'wrong'}, B.next: ${link2 ? 'A' : 'wrong'}, A.next: ${link3 ? 'null' : 'wrong'}`,
    linksOk,
    { link1, link2, link3 }
  )

  // 1c. Node values checked separately
  const val1 = returnedHead.data === 'C'
  const val2 = returnedHead.next.data === 'B'
  const val3 = returnedHead.next.next.data === 'A'
  const valsOk = val1 && val2 && val3
  recordCheck(
    'Stated Fixture: Node values along reversed links',
    'nodeA(\"A\") -> nodeB(\"B\") -> nodeC(\"C\")',
    'values: [\"C\", \"B\", \"A\"]',
    `values: [\"${returnedHead.data}\", \"${returnedHead.next.data}\", \"${returnedHead.next.next.data}\"]`,
    valsOk,
    { val1, val2, val3 }
  )

  // 1d. Observable mutation on original node instances
  const mutA = nodeA.next === null && nodeA.data === 'A'
  const mutB = nodeB.next === nodeA && nodeB.data === 'B'
  const mutC = nodeC.next === nodeB && nodeC.data === 'C'
  const mutationOk = mutA && mutB && mutC
  recordCheck(
    'Stated Fixture: Observable mutations on original nodes',
    'original node instances nodeA, nodeB, nodeC',
    'nodeA.next === null, nodeB.next === nodeA, nodeC.next === nodeB (data unmutated)',
    `nodeA.next: ${nodeA.next}, nodeB.next: ${nodeB.next === nodeA ? 'nodeA' : 'wrong'}, nodeC.next: ${nodeC.next === nodeB ? 'nodeB' : 'wrong'}`,
    mutationOk,
    { mutA, mutB, mutC }
  )
} catch (e) {
  recordCheck('Stated Fixture Execution', 'A -> B -> C', 'success', e.message, false)
}

// Check 2: Smallest supported list (null input)
try {
  const resNull = reverser.solution(null)
  const nullOk = resNull === null
  recordCheck(
    'Smallest supported input: null (empty list)',
    'null',
    'null',
    String(resNull),
    nullOk
  )
} catch (e) {
  recordCheck('Smallest supported input (null)', 'null', 'null', e.message, false)
}

// Check 3: Smallest supported list (single node)
try {
  const single = new Node('single_val')
  const resSingle = reverser.solution(single)
  const singleOk = resSingle === single && resSingle.data === 'single_val' && resSingle.next === null
  recordCheck(
    'Smallest supported input: single node',
    'Node(\"single_val\")',
    'Reference to same node with next === null and data === \"single_val\"',
    `refMatch: ${resSingle === single}, data: \"${resSingle?.data}\", next: ${resSingle?.next}`,
    singleOk
  )
} catch (e) {
  recordCheck('Smallest supported input (single node)', 'Node(\"single_val\")', 'single node', e.message, false)
}

// Check 4: Repeated-value domain boundary
try {
  const d1 = new Node('dup')
  const d2 = new Node('dup')
  const d3 = new Node('dup')
  d1.next = d2
  d2.next = d3

  const resDup = reverser.solution(d1)
  const dupRefOk = resDup === d3 && resDup.next === d2 && resDup.next.next === d1 && resDup.next.next.next === null
  const dupValOk = resDup.data === 'dup' && resDup.next.data === 'dup' && resDup.next.next.data === 'dup'
  const dupPassed = dupRefOk && dupValOk
  recordCheck(
    'Repeated-value domain boundary: duplicate node values with distinct references',
    'd1(\"dup\") -> d2(\"dup\") -> d3(\"dup\")',
    'Identity: d3 -> d2 -> d1 -> null; all values === \"dup\"',
    `refOk: ${dupRefOk}, valOk: ${dupValOk}`,
    dupPassed
  )
} catch (e) {
  recordCheck('Repeated-value domain boundary', 'dup nodes', 'passed', e.message, false)
}

// Check 5: Ordinary multi-element input
try {
  const n1 = new Node(10)
  const n2 = new Node(20)
  const n3 = new Node(30)
  const n4 = new Node(40)
  n1.next = n2
  n2.next = n3
  n3.next = n4

  const resOrd = reverser.solution(n1)
  const ordValues = []
  let curr = resOrd
  while (curr) {
    ordValues.push(curr.data)
    curr = curr.next
  }
  const ordPassed = JSON.stringify(ordValues) === JSON.stringify([40, 30, 20, 10])
  recordCheck(
    'Ordinary input: [10, 20, 30, 40]',
    '[10, 20, 30, 40]',
    '[40, 30, 20, 10]',
    JSON.stringify(ordValues),
    ordPassed
  )
} catch (e) {
  recordCheck('Ordinary input', '[10, 20, 30, 40]', '[40, 30, 20, 10]', e.message, false)
}

console.log(JSON.stringify(results))
"""

    proc = subprocess.run(
        ["node", "--input-type=module", "-e", js_code],
        cwd=repo_root,
        capture_output=True,
        text=True,
        env=env
    )

    if proc.returncode != 0:
        return {
            "allPassed": False,
            "error": proc.stderr or proc.stdout,
            "checks": []
        }

    try:
        data = json.loads(proc.stdout)
        return data
    except Exception as e:
        return {
            "allPassed": False,
            "error": f"Failed to parse JSON output: {str(e)}: {proc.stdout}",
            "checks": []
        }

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.abspath(os.path.join(script_dir, "..", ".."))

    print(f"=== Running Task R50-T041 Automated Checks ===")
    print(f"Repository Root: {repo_root}")

    # 1. Tool versions
    tools = get_tool_versions(repo_root)
    print("\n--- Tool Versions ---")
    for k, v in tools.items():
        print(f"  {k}: {v}")

    # 2. Native repository test script
    print("\n--- Native Repository Tests ---")
    native_res = run_native_tests(repo_root)
    print(f"  Command: {native_res['command']}")
    print(f"  Exit Code: {native_res['exit_code']}")
    print(f"  Passed: {native_res['passed']}")
    print(f"  Nonzero Test Count: {native_res['test_count']}")

    if not native_res["passed"] or native_res["test_count"] == 0:
        print("\nERROR: Native repository tests failed or zero tests found.")
        print(native_res["output"])
        sys.exit(1)

    # 3. Contract regression checks
    print("\n--- Contract Regression Checks ---")
    contract_res = run_contract_regression_checks(repo_root)
    for c in contract_res.get("checks", []):
        status = "PASS" if c["passed"] else "FAIL"
        print(f"  [{status}] {c['name']}")
        print(f"         Input:    {c['input']}")
        print(f"         Expected: {c['expected']}")
        print(f"         Actual:   {c['actual']}")

    if not contract_res.get("allPassed", False):
        print("\nERROR: Contract regression checks failed.")
        sys.exit(1)

    # 4. Save results to work/R50-T041/
    out_dir = script_dir
    results_payload = {
        "task_id": "R50-T041",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "tools": tools,
        "native_tests": {
            "command": native_res["command"],
            "exit_code": native_res["exit_code"],
            "passed": native_res["passed"],
            "test_count": native_res["test_count"]
        },
        "contract_checks": contract_res["checks"],
        "all_passed": True
    }

    results_path = os.path.join(out_dir, "results.json")
    with open(results_path, "w") as f:
        json.dump(results_payload, f, indent=2)

    print(f"\nAll checks passed successfully!")
    print(f"Results saved to: {results_path}")
    sys.exit(0)

if __name__ == "__main__":
    main()
