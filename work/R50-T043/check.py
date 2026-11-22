#!/usr/bin/env python3
"""
Automated check runner for Task R50-T043:
Cross-check checkSnakeCase (CheckSnakeCase.js)
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

    cmd = "npm test -- String/test/CheckSnakeCase.test.js"
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

def run_oracle_cross_checks(repo_root):
    env = os.environ.copy()
    if "/opt/homebrew/bin" not in env.get("PATH", ""):
        env["PATH"] = f"/opt/homebrew/bin:{env.get('PATH', '')}"

    js_code = """
import { checkSnakeCase } from './String/CheckSnakeCase.js'

const results = {
  checks: [],
  allPassed: true
}

// Independent reference oracle using string split instead of regex
function referenceOracle(str) {
  return str.split('_').length > 1
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
// String/CheckSnakeCase.js Line 12: "if (typeof varName !== 'string')"
// String/CheckSnakeCase.js Line 13: "throw new TypeError('Argument is not a string.')"

// Check 1: Smallest valid input ("")
try {
  const input = ''
  const actual = checkSnakeCase(input)
  const oracle = referenceOracle(input)
  const expected = false
  const passed = actual === expected && actual === oracle
  recordCheck(
    'Smallest valid input: empty string \"\"',
    'String/CheckSnakeCase.js:12',
    '\"\"',
    String(expected),
    String(actual),
    passed,
    { oracleValue: oracle }
  )
} catch (e) {
  recordCheck('Smallest valid input', 'String/CheckSnakeCase.js:12', '\"\"', 'false', e.message, false)
}

// Check 2: Ordinary input ("docker_build")
try {
  const input = 'docker_build'
  const actual = checkSnakeCase(input)
  const oracle = referenceOracle(input)
  const expected = true
  const passed = actual === expected && actual === oracle
  recordCheck(
    'Ordinary input: \"docker_build\"',
    'String/CheckSnakeCase.js:12',
    '\"docker_build\"',
    String(expected),
    String(actual),
    passed,
    { oracleValue: oracle }
  )
} catch (e) {
  recordCheck('Ordinary input', 'String/CheckSnakeCase.js:12', '\"docker_build\"', 'true', e.message, false)
}

// Enumerated 22 input cases comparing against Oracle and Expected Table
const testCases = [
  { input: '', expected: false, desc: 'empty string' },
  { input: 'a', expected: false, desc: 'single lowercase char' },
  { input: 'A', expected: false, desc: 'single uppercase char' },
  { input: 'word', expected: false, desc: 'single word' },
  { input: 'camelCase', expected: false, desc: 'camelCase identifier' },
  { input: 'PascalCase', expected: false, desc: 'PascalCase identifier' },
  { input: 'kebab-case', expected: false, desc: 'kebab-case identifier' },
  { input: 'UPPERCASE', expected: false, desc: 'all caps word' },
  { input: '12345', expected: false, desc: 'numeric string' },
  { input: '_', expected: true, desc: 'single underscore' },
  { input: '__', expected: true, desc: 'double underscore' },
  { input: 'a_b', expected: true, desc: 'short snake case' },
  { input: 'docker_build', expected: true, desc: 'standard snake case' },
  { input: 'snake_case', expected: true, desc: 'canonical snake case' },
  { input: 'first_second_third', expected: true, desc: 'multiple words' },
  { input: 'user_id', expected: true, desc: 'common identifier' },
  { input: 'val_1', expected: true, desc: 'word with digit' },
  { input: '1_2', expected: true, desc: 'digits separated by underscore' },
  { input: 'CONSTANT_CASE', expected: true, desc: 'screaming snake case' },
  { input: 'trailing_', expected: true, desc: 'trailing underscore' },
  { input: '_leading', expected: true, desc: 'leading underscore' },
  { input: 'multiple___underscores', expected: true, desc: 'consecutive underscores' }
]

let allEnumeratedPassed = true
const enumeratedDetails = []

for (const tc of testCases) {
  try {
    const actual = checkSnakeCase(tc.input)
    const oracle = referenceOracle(tc.input)
    const ok = actual === tc.expected && actual === oracle
    if (!ok) allEnumeratedPassed = false
    enumeratedDetails.push({ input: tc.input, expected: tc.expected, actual, oracle, ok })
  } catch (e) {
    allEnumeratedPassed = false
    enumeratedDetails.push({ input: tc.input, error: e.message, ok: false })
  }
}

recordCheck(
  `Oracle cross-check across ${testCases.length} enumerated domain inputs`,
  'String/CheckSnakeCase.js:12',
  `${testCases.length} small valid strings`,
  'All actual outputs match independent oracle and expected table',
  allEnumeratedPassed ? 'All 22 matched perfectly' : 'Mismatches found',
  allEnumeratedPassed,
  { totalCases: testCases.length, details: enumeratedDetails }
)

// Precondition checks for invalid inputs
const invalidInputs = [0, 123, -42, null, undefined, true, false, {}, [], () => {}]
let allPreconditionsPassed = true
for (const inv of invalidInputs) {
  try {
    checkSnakeCase(inv)
    allPreconditionsPassed = false
  } catch (e) {
    if (!(e instanceof TypeError) || e.message !== 'Argument is not a string.') {
      allPreconditionsPassed = false
    }
  }
}

recordCheck(
  'Precondition enforcement on non-string inputs (TypeError)',
  'String/CheckSnakeCase.js:12-13',
  '10 non-string types [numbers, null, undefined, boolean, objects, arrays, functions]',
  'Throws TypeError("Argument is not a string.")',
  allPreconditionsPassed ? 'Threw TypeError("Argument is not a string.") for all' : 'Unexpected error/no error',
  allPreconditionsPassed
)

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

    print("=== Running Task R50-T043 Automated Checks ===")
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

    # 3. Reference oracle cross-checks citing source line 12
    print("\n--- Reference Oracle Cross-Checks (Citing Source Preconditions) ---")
    oracle_res = run_oracle_cross_checks(repo_root)
    for c in oracle_res.get("checks", []):
        status = "PASS" if c["passed"] else "FAIL"
        print(f"  [{status}] {c['name']}")
        print(f"         Precondition Line: {c['precondition_source_line']}")
        print(f"         Input:             {c['input']}")
        print(f"         Expected:          {c['expected']}")
        print(f"         Actual:            {c['actual']}")

    if not oracle_res.get("allPassed", False):
        print("\nERROR: Oracle cross-checks failed.")
        sys.exit(1)

    # 4. Save results to work/R50-T043/results.json
    results_payload = {
        "task_id": "R50-T043",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "precondition_contract": {
            "source_file": "String/CheckSnakeCase.js",
            "precondition_lines": "12-14",
            "precondition_code": "if (typeof varName !== 'string') { throw new TypeError('Argument is not a string.') }"
        },
        "tools": tools,
        "native_tests": {
            "command": native_res["command"],
            "exit_code": native_res["exit_code"],
            "passed": native_res["passed"],
            "test_count": native_res["test_count"]
        },
        "oracle_checks": oracle_res["checks"],
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
