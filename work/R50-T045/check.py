#!/usr/bin/env python3
"""
Automated check runner for Task R50-T045:
Make verification repeatable for palindromeRearranging (CheckRearrangePalindrome.js)
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

    cmd = "npm test -- String/test/CheckRearrangePalindrome.test.js"
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

def run_repeatability_and_purity_checks(repo_root):
    env = os.environ.copy()
    if "/opt/homebrew/bin" not in env.get("PATH", ""):
        env["PATH"] = f"/opt/homebrew/bin:{env.get('PATH', '')}"

    js_code = """
import { palindromeRearranging } from './String/CheckRearrangePalindrome.js'

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

// Precondition Source Lines:
// String/CheckRearrangePalindrome.js Line 19: "if (typeof str !== 'string') return 'Not a string'"
// String/CheckRearrangePalindrome.js Line 23: "if (!str) return 'Empty string'"

// 1. Stated Fixture checks: ["", "a", "aba", "ab", "abba"]
const fixtureCases = [
  { input: '', expected: 'Empty string', line: 'String/CheckRearrangePalindrome.js:23', desc: 'empty string' },
  { input: 'a', expected: true, line: 'String/CheckRearrangePalindrome.js:19,23', desc: 'single character "a"' },
  { input: 'aba', expected: true, line: 'String/CheckRearrangePalindrome.js:19,23', desc: 'odd palindrome "aba"' },
  { input: 'ab', expected: false, line: 'String/CheckRearrangePalindrome.js:19,23', desc: 'non-palindrome "ab"' },
  { input: 'abba', expected: true, line: 'String/CheckRearrangePalindrome.js:19,23', desc: 'even palindrome "abba"' }
]

for (const fc of fixtureCases) {
  try {
    const actual = palindromeRearranging(fc.input)
    const passed = actual === fc.expected
    recordCheck(
      `Stated Fixture: ${fc.desc}`,
      fc.line,
      JSON.stringify(fc.input),
      JSON.stringify(fc.expected),
      JSON.stringify(actual),
      passed
    )
  } catch (e) {
    recordCheck(`Stated Fixture: ${fc.desc}`, fc.line, JSON.stringify(fc.input), JSON.stringify(fc.expected), e.message, false)
  }
}

// 2. Normalization Specification Verification
// Normalization is NOT performed: case is preserved, so 'Aa' (1 'A', 1 'a') has 2 odd counts -> false
try {
  const actualAa = palindromeRearranging('Aa')
  const actualAAaa = palindromeRearranging('AAaa')
  const passedNorm = actualAa === false && actualAAaa === true
  recordCheck(
    'Normalization Policy: Case-sensitive, no normalization performed',
    'String/CheckRearrangePalindrome.js:28-33',
    '["Aa", "AAaa"]',
    'Aa -> false, AAaa -> true',
    `Aa -> ${actualAa}, AAaa -> ${actualAAaa}`,
    passedNorm
  )
} catch (e) {
  recordCheck('Normalization Policy', 'String/CheckRearrangePalindrome.js:28-33', 'Aa', 'false', e.message, false)
}

// 3. Repeatability & Input Isolation: Run twice fresh, once after interleaved
const fixtureInputs = ['', 'a', 'aba', 'ab', 'abba']
const run1 = fixtureInputs.map(s => palindromeRearranging(s))
const run2 = fixtureInputs.map(s => palindromeRearranging(s))

// Interleaved execution with distinct inputs
palindromeRearranging('racecar')
palindromeRearranging('not_a_palindrome_12345')
palindromeRearranging('xyzzyx')

const run3 = fixtureInputs.map(s => palindromeRearranging(s))

const run1VsRun2 = JSON.stringify(run1) === JSON.stringify(run2)
const run1VsRun3 = JSON.stringify(run1) === JSON.stringify(run3)
const repeatabilityPassed = run1VsRun2 && run1VsRun3

recordCheck(
  'Repeatability & Input Isolation: 3 consecutive & interleaved executions',
  'String/CheckRearrangePalindrome.js:28-35',
  'fixture run1 (fresh), run2 (immediate repeat), run3 (after interleaved calls)',
  'run1 === run2 === run3 (identical outputs)',
  `run1 == run2: ${run1VsRun2}, run1 == run3: ${run1VsRun3}`,
  repeatabilityPassed,
  { run1, run2, run3 }
)

// 4. Precondition sentinel checks on non-string inputs
const nonStringCases = [0, 121, null, undefined, {}, []]
let allNonStringsPassed = true
for (const ns of nonStringCases) {
  if (palindromeRearranging(ns) !== 'Not a string') {
    allNonStringsPassed = false
  }
}

recordCheck(
  'Precondition enforcement: Non-string inputs return "Not a string" sentinel',
  'String/CheckRearrangePalindrome.js:19',
  '[0, 121, null, undefined, {}, []]',
  '"Not a string" for all non-strings',
  allNonStringsPassed ? 'Returned "Not a string" for all' : 'Unexpected return value',
  allNonStringsPassed
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

    print("=== Running Task R50-T045 Automated Checks ===")
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

    # 3. Repeatability, purity & fixture checks
    print("\n--- Repeatability & Purity Checks (Citing Source Preconditions) ---")
    purity_res = run_repeatability_and_purity_checks(repo_root)
    for c in purity_res.get("checks", []):
        status = "PASS" if c["passed"] else "FAIL"
        print(f"  [{status}] {c['name']}")
        print(f"         Precondition Line: {c['precondition_source_line']}")
        print(f"         Input:             {c['input']}")
        print(f"         Expected:          {c['expected']}")
        print(f"         Actual:            {c['actual']}")

    if not purity_res.get("allPassed", False):
        print("\nERROR: Repeatability & purity checks failed.")
        sys.exit(1)

    # 4. Save results to work/R50-T045/results.json
    results_payload = {
        "task_id": "R50-T045",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "preconditions": {
            "source_file": "String/CheckRearrangePalindrome.js",
            "type_check_line": "19: if (typeof str !== 'string') return 'Not a string'",
            "empty_check_line": "23: if (!str) return 'Empty string'",
            "normalization_policy": "No normalization performed (case-sensitive exact character counting)"
        },
        "tools": tools,
        "native_tests": {
            "command": native_res["command"],
            "exit_code": native_res["exit_code"],
            "passed": native_res["passed"],
            "test_count": native_res["test_count"]
        },
        "repeatability_checks": purity_res["checks"],
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
