#!/usr/bin/env python3
"""
Automated check runner for Task R50-T042:
Define the supported boundaries of quickSelectSearch (QuickSelectSearch.js)
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

    cmd = "npm test -- Search/test/QuickSelectSearch.test.js"
    proc = subprocess.run(cmd, shell=True, cwd=repo_root, capture_output=True, text=True, env=env)

    output = proc.stdout + "\n" + proc.stderr
    passed = proc.returncode == 0

    test_count = 0
    for line in output.splitlines():
        if "Tests" in line and "passed" in line:
            parts = line.strip().split()
            for p in parts:
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

def run_boundary_contract_checks(repo_root):
    env = os.environ.copy()
    if "/opt/homebrew/bin" not in env.get("PATH", ""):
        env["PATH"] = f"/opt/homebrew/bin:{env.get('PATH', '')}"

    js_code = """
import { quickSelectSearch } from './Search/QuickSelectSearch.js'

const results = {
  checks: [],
  allPassed: true
}

function recordCheck(name, preconditionLine, inputDesc, expected, actual, passed, details = {}) {
  results.checks.push({
    name,
    precondition_source_line: preconditionLine,
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

// Precondition Source Line Reference:
// Search/QuickSelectSearch.js Line 15: "if (!array || array.length <= k)"
// Search/QuickSelectSearch.js Line 16: "throw new Error('Invalid arguments')"

// Boundary Check 1: Smallest valid input (1-element array, k = 0)
try {
  const input = [42]
  const k = 0
  const expected = [42]
  const actual = quickSelectSearch([...input], k)
  const passed = actual[0] === 42 && actual.length === 1
  recordCheck(
    'Smallest valid input (1-element array, k = 0)',
    'Search/QuickSelectSearch.js:15',
    'array = [42], k = 0',
    JSON.stringify(expected),
    JSON.stringify(actual),
    passed
  )
} catch (e) {
  recordCheck('Smallest valid input', 'Search/QuickSelectSearch.js:15', '[42], k=0', '[42]', e.message, false)
}

// Boundary Check 2: Ordinary input (unsorted array, median k = 4)
try {
  const input = [9, 2, 7, 4, 5, 6, 3, 8, 1]
  const k = 4
  const expectedKVal = 5
  const actual = quickSelectSearch([...input], k)
  const leftValid = actual.slice(0, 4).every(x => x <= expectedKVal)
  const rightValid = actual.slice(5).every(x => x >= expectedKVal)
  const passed = actual[4] === expectedKVal && leftValid && rightValid
  recordCheck(
    'Ordinary input: 9 elements, target median k = 4',
    'Search/QuickSelectSearch.js:15',
    '[9, 2, 7, 4, 5, 6, 3, 8, 1], k = 4',
    'result[4] === 5 with left <= 5 and right >= 5',
    `result[4] = ${actual[4]}, array = ${JSON.stringify(actual)}`,
    passed,
    { leftValid, rightValid }
  )
} catch (e) {
  recordCheck('Ordinary input', 'Search/QuickSelectSearch.js:15', '9 elements, k=4', '5 at index 4', e.message, false)
}

// Boundary Check 3: Lower supported boundary (k = 0 on multi-element array)
try {
  const input = [5, 1, 9, 3, 7]
  const k = 0
  const actual = quickSelectSearch([...input], k)
  const passed = actual[0] === 1 && actual.slice(1).every(x => x >= 1)
  recordCheck(
    'Lower supported boundary: k = 0',
    'Search/QuickSelectSearch.js:15',
    '[5, 1, 9, 3, 7], k = 0',
    'result[0] === 1 (minimum element)',
    `result[0] = ${actual[0]}, array = ${JSON.stringify(actual)}`,
    passed
  )
} catch (e) {
  recordCheck('Lower supported boundary', 'Search/QuickSelectSearch.js:15', 'k=0', '1 at index 0', e.message, false)
}

// Boundary Check 4: Upper supported boundary (k = array.length - 1)
try {
  const input = [5, 1, 9, 3, 7]
  const k = 4 // array.length - 1
  const actual = quickSelectSearch([...input], k)
  const passed = actual[4] === 9 && actual.slice(0, 4).every(x => x <= 9)
  recordCheck(
    'Upper supported boundary: k = array.length - 1',
    'Search/QuickSelectSearch.js:15',
    '[5, 1, 9, 3, 7], k = 4',
    'result[4] === 9 (maximum element)',
    `result[4] = ${actual[4]}, array = ${JSON.stringify(actual)}`,
    passed
  )
} catch (e) {
  recordCheck('Upper supported boundary', 'Search/QuickSelectSearch.js:15', 'k=4', '9 at index 4', e.message, false)
}

// Boundary Check 5: Duplicate elements domain boundary
try {
  const input = [3, 1, 3, 2, 3]
  const k = 2
  const actual = quickSelectSearch([...input], k)
  const passed = actual[2] === 3
  recordCheck(
    'Domain boundary: duplicate elements',
    'Search/QuickSelectSearch.js:15',
    '[3, 1, 3, 2, 3], k = 2',
    'result[2] === 3',
    `result[2] = ${actual[2]}, array = ${JSON.stringify(actual)}`,
    passed
  )
} catch (e) {
  recordCheck('Duplicate elements boundary', 'Search/QuickSelectSearch.js:15', '[3,1,3,2,3], k=2', '3 at index 2', e.message, false)
}

// Boundary Check 6 (Unsupported): k equals array.length (just beyond upper boundary)
try {
  quickSelectSearch([10, 20, 30], 3)
  recordCheck('Unsupported boundary: k === array.length', 'Search/QuickSelectSearch.js:15', '[10, 20, 30], k = 3', 'throw Error("Invalid arguments")', 'No error thrown', false)
} catch (e) {
  const passed = e.message === 'Invalid arguments'
  recordCheck(
    'Unsupported boundary: k === array.length',
    'Search/QuickSelectSearch.js:15-16',
    '[10, 20, 30], k = 3',
    'throw Error("Invalid arguments")',
    `threw Error("${e.message}")`,
    passed
  )
}

// Boundary Check 7 (Unsupported): k exceeds array.length
try {
  quickSelectSearch([10, 20, 30], 5)
  recordCheck('Unsupported boundary: k > array.length', 'Search/QuickSelectSearch.js:15', '[10, 20, 30], k = 5', 'throw Error("Invalid arguments")', 'No error thrown', false)
} catch (e) {
  const passed = e.message === 'Invalid arguments'
  recordCheck(
    'Unsupported boundary: k > array.length',
    'Search/QuickSelectSearch.js:15-16',
    '[10, 20, 30], k = 5',
    'throw Error("Invalid arguments")',
    `threw Error("${e.message}")`,
    passed
  )
}

// Boundary Check 8 (Unsupported): Empty array
try {
  quickSelectSearch([], 0)
  recordCheck('Unsupported boundary: empty array', 'Search/QuickSelectSearch.js:15', '[], k = 0', 'throw Error("Invalid arguments")', 'No error thrown', false)
} catch (e) {
  const passed = e.message === 'Invalid arguments'
  recordCheck(
    'Unsupported boundary: empty array',
    'Search/QuickSelectSearch.js:15-16',
    '[], k = 0',
    'throw Error("Invalid arguments")',
    `threw Error("${e.message}")`,
    passed
  )
}

// Boundary Check 9 (Unsupported): Falsy array (null)
try {
  quickSelectSearch(null, 0)
  recordCheck('Unsupported boundary: null array', 'Search/QuickSelectSearch.js:15', 'null, k = 0', 'throw Error("Invalid arguments")', 'No error thrown', false)
} catch (e) {
  const passed = e.message === 'Invalid arguments'
  recordCheck(
    'Unsupported boundary: null array',
    'Search/QuickSelectSearch.js:15-16',
    'null, k = 0',
    'throw Error("Invalid arguments")',
    `threw Error("${e.message}")`,
    passed
  )
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
        return json.loads(proc.stdout)
    except Exception as e:
        return {
            "allPassed": False,
            "error": f"Failed to parse JSON output: {str(e)}: {proc.stdout}",
            "checks": []
        }

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.abspath(os.path.join(script_dir, "..", ".."))

    print("=== Running Task R50-T042 Automated Checks ===")
    print(f"Repository Root: {repo_root}")

    # 1. Tool versions
    tools = get_tool_versions(repo_root)
    print("\n--- Tool Versions ---")
    for k, v in tools.items():
        print(f"  {k}: {v}")

    # 2. Native repository tests
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

    # 3. Boundary contract checks citing source line 15
    print("\n--- Boundary Contract Checks (Citing Source Preconditions) ---")
    boundary_res = run_boundary_contract_checks(repo_root)
    for c in boundary_res.get("checks", []):
        status = "PASS" if c["passed"] else "FAIL"
        print(f"  [{status}] {c['name']}")
        print(f"         Precondition Line: {c['precondition_source_line']}")
        print(f"         Input:             {c['input']}")
        print(f"         Expected:          {c['expected']}")
        print(f"         Actual:            {c['actual']}")

    if not boundary_res.get("allPassed", False):
        print("\nERROR: Boundary contract checks failed.")
        sys.exit(1)

    # 4. Save results to work/R50-T042/results.json
    results_payload = {
        "task_id": "R50-T042",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "precondition_contract": {
            "source_file": "Search/QuickSelectSearch.js",
            "precondition_lines": "15-16",
            "precondition_code": "if (!array || array.length <= k) { throw new Error('Invalid arguments') }"
        },
        "tools": tools,
        "native_tests": {
            "command": native_res["command"],
            "exit_code": native_res["exit_code"],
            "passed": native_res["passed"],
            "test_count": native_res["test_count"]
        },
        "boundary_checks": boundary_res["checks"],
        "all_passed": True
    }

    results_path = os.path.join(script_dir, "results.json")
    with open(results_path, "w") as f:
        json.dump(results_payload, f, indent=2)

    # Prettier format results.json to avoid pre-commit hook failure
    env = os.environ.copy()
    if "/opt/homebrew/bin" not in env.get("PATH", ""):
        env["PATH"] = f"/opt/homebrew/bin:{env.get('PATH', '')}"
    subprocess.run(["npx", "prettier", results_path, "--write"], cwd=repo_root, capture_output=True, env=env)

    print(f"\nAll checks passed successfully!")
    print(f"Results saved to: {results_path}")
    sys.exit(0)

if __name__ == "__main__":
    main()
