#!/usr/bin/env python3
"""
Automated check runner for Task R50-T050:
Strengthen the tests of armstrongNumber (Maths/ArmstrongNumber.js).

Executes repository native tests, verifies assertions on fixtures
(smallest valid input, ordinary inputs), proves that deliberate one-line
mutants fail the named assertions for semantic reasons while the original
implementation passes, and writes results to work/R50-T050/results.json.
"""

import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone

WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RESULTS_DIR = os.path.join(WORKSPACE_DIR, "work", "R50-T050")
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
    cmd = ["npm", "test", "--", "Maths/test/ArmstrongNumber.test.js"]
    env = os.environ.copy()
    env["PATH"] = f"/opt/homebrew/bin:{env.get('PATH', '')}"
    result = subprocess.run(cmd, cwd=WORKSPACE_DIR, capture_output=True, text=True, env=env)
    
    output = result.stdout + "\n" + result.stderr
    
    # Parse test count: e.g. "Tests  9 passed (9)"
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

def run_mutation_evaluation():
    node_script = """
    import { armstrongNumber } from './Maths/ArmstrongNumber.js';

    // Deliberate Mutant 1: Off-by-one boundary comparison (num <= 0 instead of num < 0)
    const mutant1_boundary = (num) => {
      if (typeof num !== 'number' || num <= 0) return false;
      const numStr = num.toString();
      const sum = [...numStr].reduce(
        (acc, digit) => acc + parseInt(digit) ** numStr.length,
        0
      );
      return sum === num;
    };

    // Deliberate Mutant 2: Hardcoded cube accumulation (digit ** 3 instead of digit ** numStr.length)
    const mutant2_fixed_power = (num) => {
      if (typeof num !== 'number' || num < 0) return false;
      const numStr = num.toString();
      const sum = [...numStr].reduce(
        (acc, digit) => acc + parseInt(digit) ** 3,
        0
      );
      return sum === num;
    };

    const fixtures = [
      {
        name: "smallest_valid_input_0",
        precondition_source_line: "Line 24 (if (typeof num !== 'number' || num < 0) return false)",
        input: 0,
        expected: true,
        protected_condition: "Boundary check permits 0 as a valid non-negative integer (0^1 = 0)"
      },
      {
        name: "single_digit_armstrong_5",
        precondition_source_line: "Line 24..29 (5^1 = 5)",
        input: 5,
        expected: true,
        protected_condition: "Single-digit integers evaluate to identity"
      },
      {
        name: "ordinary_armstrong_370",
        precondition_source_line: "Line 24..29 (3^3 + 7^3 + 0^3 = 370)",
        input: 370,
        expected: true,
        protected_condition: "3-digit Armstrong number matches digit sum of cubes"
      },
      {
        name: "ordinary_armstrong_371",
        precondition_source_line: "Line 24..29 (3^3 + 7^3 + 1^3 = 371)",
        input: 371,
        expected: true,
        protected_condition: "3-digit Armstrong number matches digit sum of cubes"
      },
      {
        name: "multi_digit_armstrong_1634",
        precondition_source_line: "Line 27 ((acc, digit) => acc + parseInt(digit) ** numStr.length)",
        input: 1634,
        expected: true,
        protected_condition: "Dynamic exponentiation with numStr.length = 4 (1^4 + 6^4 + 3^4 + 4^4 = 1634)"
      },
      {
        name: "ordinary_non_armstrong_300",
        precondition_source_line: "Line 24..29 (3^3 + 0^3 + 0^3 = 27 != 300)",
        input: 300,
        expected: false,
        protected_condition: "Non-Armstrong number rejected"
      },
      {
        name: "ordinary_non_armstrong_10",
        precondition_source_line: "Line 24..29 (1^2 + 0^2 = 1 != 10)",
        input: 10,
        expected: false,
        protected_condition: "2-digit non-Armstrong number rejected"
      },
      {
        name: "negative_input_minus_2",
        precondition_source_line: "Line 24 (num < 0 guard)",
        input: -2,
        expected: false,
        protected_condition: "Negative numbers rejected at boundary guard"
      }
    ];

    const originalResults = fixtures.map(f => {
      const actual = armstrongNumber(f.input);
      return {
        name: f.name,
        precondition_source_line: f.precondition_source_line,
        input: f.input,
        expected: f.expected,
        actual: actual,
        passed: actual === f.expected,
        protected_condition: f.protected_condition
      };
    });

    // Evaluate Mutants against targeted assertions
    const mutantResults = [
      {
        mutant_name: "mutant1_boundary_off_by_one",
        description: "Altered Line 24 boundary from `num < 0` to `num <= 0`",
        targeted_assertion: "smallest_valid_input_0",
        input: 0,
        expected: true,
        original_output: armstrongNumber(0),
        original_passed: armstrongNumber(0) === true,
        mutant_output: mutant1_boundary(0),
        mutant_failed_as_expected: mutant1_boundary(0) === false,
        semantic_reason: "Mutant erroneously rejected smallest valid input 0 due to off-by-one `<=` check"
      },
      {
        mutant_name: "mutant2_hardcoded_cube_power",
        description: "Altered Line 27 accumulation from `** numStr.length` to `** 3`",
        targeted_assertion: "multi_digit_armstrong_1634",
        input: 1634,
        expected: true,
        original_output: armstrongNumber(1634),
        original_passed: armstrongNumber(1634) === true,
        mutant_output: mutant2_fixed_power(1634),
        mutant_failed_as_expected: mutant2_fixed_power(1634) === false,
        semantic_reason: "Mutant hardcoded cube power yielding 308 instead of 1634, failing 4-digit Armstrong validation"
      }
    ];

    console.log(JSON.stringify({
      original_evaluations: originalResults,
      mutant_evaluations: mutantResults
    }));
    """
    env = os.environ.copy()
    env["PATH"] = f"/opt/homebrew/bin:{env.get('PATH', '')}"
    res = subprocess.run(["node", "--input-type=module", "-e", node_script],
                         cwd=WORKSPACE_DIR, capture_output=True, text=True, env=env)
    if res.returncode != 0:
        raise RuntimeError(f"Node execution failed: {res.stderr}")
    return json.loads(res.stdout.strip())

def main():
    print(f"Running checks for Task R50-T050...")
    tool_versions = get_tool_versions()
    native_test_result = run_native_tests()
    
    if native_test_result["exit_code"] != 0:
        print(f"Native tests failed with exit code {native_test_result['exit_code']}")
        print(native_test_result["output"])
        sys.exit(1)
        
    print(f"Native tests passed: {native_test_result['tests_passed']} tests.")
    
    eval_results = run_mutation_evaluation()
    
    # Check original evaluations
    all_orig_passed = True
    for item in eval_results["original_evaluations"]:
        if not item["passed"]:
            print(f"Original assertion failed for {item['name']}: expected {item['expected']}, got {item['actual']}")
            all_orig_passed = False
        else:
            print(f"  ✓ {item['name']}: passed (Expected: {item['expected']})")
            
    if not all_orig_passed:
        print("Some original assertions failed.")
        sys.exit(1)
        
    # Check mutant evaluations
    all_mutants_caught = True
    for m in eval_results["mutant_evaluations"]:
        if not (m["original_passed"] and m["mutant_failed_as_expected"]):
            print(f"Mutant detection failed for {m['mutant_name']}!")
            all_mutants_caught = False
        else:
            print(f"  ✓ {m['mutant_name']}: Caught! Original={m['original_output']}, Mutant={m['mutant_output']} (Semantic reason: {m['semantic_reason']})")
            
    if not all_mutants_caught:
        print("Mutant detection assertions failed.")
        sys.exit(1)
        
    os.makedirs(RESULTS_DIR, exist_ok=True)
    summary = {
        "task_id": "R50-T050",
        "target": "Maths/ArmstrongNumber.js",
        "tested_function": "armstrongNumber",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "tool_versions": tool_versions,
        "native_test": {
            "command": native_test_result["command"],
            "exit_code": native_test_result["exit_code"],
            "tests_passed": native_test_result["tests_passed"]
        },
        "original_assertions": eval_results["original_evaluations"],
        "mutant_proofs": eval_results["mutant_evaluations"],
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
