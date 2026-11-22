#!/usr/bin/env python3
"""
Automated check runner for Task R50-T047:
Publish a runnable example for isMatrixValid (Maths/RowEchelon.js).

Executes repository native tests, verifies assertions on fixtures
(small rectangular matrix, 1x1 matrix, zero-containing matrix, doc examples),
and writes results to work/R50-T047/results.json.
"""

import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone

WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RESULTS_DIR = os.path.join(WORKSPACE_DIR, "work", "R50-T047")
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
    cmd = ["npm", "test", "--", "Maths/test/RowEchelon.test.js"]
    env = os.environ.copy()
    env["PATH"] = f"/opt/homebrew/bin:{env.get('PATH', '')}"
    result = subprocess.run(cmd, cwd=WORKSPACE_DIR, capture_output=True, text=True, env=env)
    
    output = result.stdout + "\n" + result.stderr
    
    # Parse test count: e.g. "Tests  12 passed (12)"
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
    import { isMatrixValid, rowEchelon } from './Maths/RowEchelon.js';

    const fixtures = [
      {
        name: "small_rectangular_matrix_2x3",
        input: [[1, 2, 3], [4, 5, 6]],
        expected: true
      },
      {
        name: "small_rectangular_matrix_3x2",
        input: [[1, 2], [3, 4], [5, 6]],
        expected: true
      },
      {
        name: "1x1_matrix",
        input: [[42]],
        expected: true
      },
      {
        name: "1x1_matrix_zero",
        input: [[0]],
        expected: true
      },
      {
        name: "zero_containing_matrix_2x2",
        input: [[0, 5], [0, 0]],
        expected: true
      },
      {
        name: "zero_containing_matrix_all_zero_rectangular",
        input: [[0, 0, 0], [0, 0, 0]],
        expected: true
      },
      {
        name: "doc_example_rectangular_2x3",
        input: [[1, 2, 3], [4, 5, 6]],
        expected: true
      },
      {
        name: "doc_example_1x1",
        input: [[42]],
        expected: true
      },
      {
        name: "doc_example_zero_containing",
        input: [[0, 5], [0, 0]],
        expected: true
      },
      {
        name: "doc_example_ragged_rejection",
        input: [[1, 2], [3]],
        expected: false
      },
      {
        name: "ragged_matrix_deviation",
        input: [[1, 2, 3], [4, 5]],
        expected: false
      },
      {
        name: "empty_matrix",
        input: [],
        expected: false
      },
      {
        name: "row_echelon_1x1_transform",
        input: [[42]],
        expected: [[1]],
        transform: true
      }
    ];

    const results = fixtures.map(f => {
      let actual;
      if (f.transform) {
        actual = rowEchelon(f.input);
      } else {
        actual = isMatrixValid(f.input);
      }
      return {
        name: f.name,
        input: f.input,
        expected: f.expected,
        actual: actual,
        passed: JSON.stringify(actual) === JSON.stringify(f.expected)
      };
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
    print(f"Running checks for Task R50-T047...")
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
            print(f"  ✓ {item['name']}: passed")
            
    if not all_passed:
        print("Some assertions failed.")
        sys.exit(1)
        
    os.makedirs(RESULTS_DIR, exist_ok=True)
    summary = {
        "task_id": "R50-T047",
        "target": "Maths/RowEchelon.js",
        "tested_function": "isMatrixValid",
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
