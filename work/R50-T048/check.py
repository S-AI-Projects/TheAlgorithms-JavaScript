#!/usr/bin/env python3
"""
Automated check runner for Task R50-T048:
Cover the failure behavior of FloydWarshall (Graphs/FloydWarshall.js).

Executes repository native tests, verifies assertions on fixtures
(smallest valid input, ordinary input, empty-result/absent-path branches,
and caller-owned sequential call validity), and writes results to
work/R50-T048/results.json.
"""

import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone

WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RESULTS_DIR = os.path.join(WORKSPACE_DIR, "work", "R50-T048")
RESULTS_PATH = os.path.join(RESULTS_DIR, "results.json")

def get_tool_versions():
    versions = {}
    # Python
    versions["python"] = sys.version.split()[0]
    
    # Node
    try:
        out = subprocess.run(["node", "--version"], capture_output=True, text=True, check=True)
        versions["node"] = out.stdout.strip()
    except Exception as e:
        versions["node"] = str(e)
        
    # npm
    try:
        out = subprocess.run(["npm", "--version"], capture_output=True, text=True, check=True)
        versions["npm"] = out.stdout.strip()
    except Exception as e:
        versions["npm"] = str(e)

    # vitest
    try:
        out = subprocess.run(["npx", "vitest", "--version"], cwd=WORKSPACE_DIR, capture_output=True, text=True, check=True)
        versions["vitest"] = out.stdout.strip()
    except Exception as e:
        versions["vitest"] = str(e)

    return versions

def run_native_tests():
    cmd = ["npm", "test", "--", "Graphs/test/FloydWarshall.test.js"]
    env = os.environ.copy()
    env["PATH"] = f"/opt/homebrew/bin:{env.get('PATH', '')}"
    result = subprocess.run(cmd, cwd=WORKSPACE_DIR, capture_output=True, text=True, env=env)
    
    output = result.stdout + "\n" + result.stderr
    
    # Parse test count: e.g. "Tests  6 passed (6)"
    tests_passed = 0
    match = re.search(r"Tests\s+(\d+)\s+passed", output)
    if match:
        tests_passed = int(match.group(1))
    
    return {
        "command": " ".join(cmd),
        "exit_code": result.returncode,
        "tests_passed": tests_passed,
        "output": output
    }

def run_node_eval():
    node_script = """
    import { FloydWarshall } from './Graphs/FloydWarshall.js';

    const fixtures = [
      {
        name: "smallest_valid_input_1x1",
        precondition_source_line: "Line 24 (const n = dist.length = 1)",
        input: [[0]],
        expected: [[0]]
      },
      {
        name: "empty_result_path_0x0",
        precondition_source_line: "Line 24 (n = 0) -> Line 25 (loop skipped) -> Line 35 (return dist)",
        input: [],
        expected: []
      },
      {
        name: "absent_path_disconnected_sentinel",
        precondition_source_line: "Line 28 (dist[i][j] > dist[i][k] + dist[k][j] evaluates false) -> preserves Infinity",
        input: [[0, Infinity], [Infinity, 0]],
        expected: [[0, Infinity], [Infinity, 0]]
      },
      {
        name: "ordinary_input_4x4",
        precondition_source_line: "Line 24..35 (full iterative relaxation across 4 vertices)",
        input: [
          [0, 1, 2, Infinity],
          [1, 0, Infinity, Infinity],
          [2, Infinity, 0, 1],
          [Infinity, Infinity, 1, 0]
        ],
        expected: [
          [0, 1, 2, 3],
          [1, 0, 3, 4],
          [2, 3, 0, 1],
          [3, 4, 1, 0]
        ]
      },
      {
        name: "ordinary_directed_graph_5x5",
        precondition_source_line: "Line 24..35 (relaxation with negative weights)",
        input: [
          [0, 3, 8, Infinity, -4],
          [Infinity, 0, Infinity, 1, 7],
          [Infinity, 4, 0, Infinity, Infinity],
          [2, Infinity, -5, 0, Infinity],
          [Infinity, Infinity, Infinity, 6, 0]
        ],
        expected: [
          [0, 1, -3, 2, -4],
          [3, 0, -4, 1, -1],
          [7, 4, 0, 5, 3],
          [2, -1, -5, 0, -2],
          [8, 5, 1, 6, 0]
        ]
      }
    ];

    const cloneMatrix = (mat) => {
      if (!Array.isArray(mat)) return mat;
      return mat.map(row => Array.isArray(row) ? [...row] : row);
    };

    const results = fixtures.map(f => {
      const inputCopy = cloneMatrix(f.input);
      const actual = FloydWarshall(inputCopy);
      const actualNormalized = Array.isArray(actual)
        ? actual.map(row => Array.isArray(row) ? row.map(v => v === Infinity ? "Infinity" : v) : row)
        : actual;
      const expectedNormalized = Array.isArray(f.expected)
        ? f.expected.map(row => Array.isArray(row) ? row.map(v => v === Infinity ? "Infinity" : v) : row)
        : f.expected;
      return {
        name: f.name,
        precondition_source_line: f.precondition_source_line,
        input: f.input.map(row => Array.isArray(row) ? row.map(v => v === Infinity ? "Infinity" : v) : row),
        expected: expectedNormalized,
        actual: actualNormalized,
        passed: JSON.stringify(actualNormalized) === JSON.stringify(expectedNormalized)
      };
    });

    // Test sequential validity: empty call followed by ordinary call
    const emptyResult = FloydWarshall([]);
    const ordResult = FloydWarshall([
      [0, 1, 2, Infinity],
      [1, 0, Infinity, Infinity],
      [2, Infinity, 0, 1],
      [Infinity, Infinity, 1, 0]
    ]);
    const expectedOrd = [
      [0, 1, 2, 3],
      [1, 0, 3, 4],
      [2, 3, 0, 1],
      [3, 4, 1, 0]
    ];
    results.push({
      name: "sequential_call_after_failure_or_empty",
      precondition_source_line: "Line 24..35 (valid execution after empty branch)",
      input: "FloydWarshall([]) then FloydWarshall(ordinaryInput)",
      expected: expectedOrd,
      actual: ordResult,
      passed: JSON.stringify(emptyResult) === "[]" && JSON.stringify(ordResult) === JSON.stringify(expectedOrd)
    });

    console.log(JSON.stringify(results));
    """
    env = os.environ.copy()
    env["PATH"] = f"/opt/homebrew/bin:{env.get('PATH', '')}"
    res = subprocess.run(["node", "--input-type=module", "-e", node_script],
                         cwd=WORKSPACE_DIR, capture_output=True, text=True, env=env)
    if res.returncode != 0:
        raise RuntimeError(f"Node execution failed: {res.stderr}")
    return json.loads(res.stdout.strip())

def main():
    print(f"Running checks for Task R50-T048...")
    tool_versions = get_tool_versions()
    native_test_result = run_native_tests()
    
    if native_test_result["exit_code"] != 0:
        print(f"Native tests failed with exit code {native_test_result['exit_code']}")
        print(native_test_result["output"])
        sys.exit(1)
        
    print(f"Native tests passed: {native_test_result['tests_passed']} tests.")
    
    assertion_results = run_node_eval()
    all_passed = True
    for item in assertion_results:
        if not item["passed"]:
            print(f"Assertion failed for {item['name']}: expected {item['expected']}, got {item['actual']}")
            all_passed = False
        else:
            print(f"  ✓ {item['name']}: passed (Precondition: {item['precondition_source_line']})")
            
    if not all_passed:
        print("Some assertions failed.")
        sys.exit(1)
        
    os.makedirs(RESULTS_DIR, exist_ok=True)
    summary = {
        "task_id": "R50-T048",
        "target": "Graphs/FloydWarshall.js",
        "tested_function": "FloydWarshall",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "tool_versions": tool_versions,
        "native_test": {
            "command": native_test_result["command"],
            "exit_code": native_test_result["exit_code"],
            "tests_passed": native_test_result["tests_passed"]
        },
        "assertions": assertion_results,
        "status": "PASSED"
    }
    
    with open(RESULTS_PATH, "w") as f:
        json.dump(summary, f, indent=2)
    print(f"Results written to {RESULTS_PATH}")
    
    # Format with prettier to satisfy pre-commit hook
    env = os.environ.copy()
    env["PATH"] = f"/opt/homebrew/bin:{env.get('PATH', '')}"
    subprocess.run(["npx", "prettier", RESULTS_PATH, "--write"], cwd=WORKSPACE_DIR, env=env, check=False)
    print(f"Prettier formatting applied to {RESULTS_PATH}")

if __name__ == "__main__":
    main()
