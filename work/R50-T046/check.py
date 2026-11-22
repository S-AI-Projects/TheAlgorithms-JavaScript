#!/usr/bin/env python3
"""
Automated check runner for Task R50-T046:
Simplify one responsibility in lucas (LucasSeries.js)
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

    cmd = "npm test -- Maths/test/LucasSeries.test.js"
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

def run_refactoring_and_contract_checks(repo_root):
    env = os.environ.copy()
    if "/opt/homebrew/bin" not in env.get("PATH", ""):
        env["PATH"] = f"/opt/homebrew/bin:{env.get('PATH', '')}"

    js_code = """
import { lucas } from './Maths/LucasSeries.js'

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
// Maths/LucasSeries.js Line 21: "if (index < 0) throw new TypeError('Index cannot be Negative')"
// Maths/LucasSeries.js Line 24: "if (Math.floor(index) !== index) throw new TypeError('Index cannot be a Decimal')"

// Check 1: Smallest valid input: index = 0 -> L_0 = 2
try {
  const input = 0
  const expected = 2
  const actual = lucas(input)
  const passed = actual === expected
  recordCheck(
    'Smallest valid input: index 0 (L_0)',
    'Maths/LucasSeries.js:21',
    '0',
    String(expected),
    String(actual),
    passed
  )
} catch (e) {
  recordCheck('Smallest valid input', 'Maths/LucasSeries.js:21', '0', '2', e.message, false)
}

// Check 2: Ordinary input: index = 5 -> L_5 = 11
try {
  const input = 5
  const expected = 11
  const actual = lucas(input)
  const passed = actual === expected
  recordCheck(
    'Ordinary input: index 5 (L_5)',
    'Maths/LucasSeries.js:21,24',
    '5',
    String(expected),
    String(actual),
    passed
  )
} catch (e) {
  recordCheck('Ordinary input', 'Maths/LucasSeries.js:21,24', '5', '11', e.message, false)
}

// Check 3: Ordinary input: index = 20 -> L_20 = 15127
try {
  const input = 20
  const expected = 15127
  const actual = lucas(input)
  const passed = actual === expected
  recordCheck(
    'Ordinary input: index 20 (L_20)',
    'Maths/LucasSeries.js:21,24',
    '20',
    String(expected),
    String(actual),
    passed
  )
} catch (e) {
  recordCheck('Ordinary input (20)', 'Maths/LucasSeries.js:21,24', '20', '15127', e.message, false)
}

// Check 4: Recurrence series correctness for first 8 terms: [2, 1, 3, 4, 7, 11, 18, 29]
try {
  const expectedSeries = [2, 1, 3, 4, 7, 11, 18, 29]
  const actualSeries = []
  let seriesOk = true
  for (let n = 0; n < expectedSeries.length; n++) {
    const val = lucas(n)
    actualSeries.push(val)
    if (val !== expectedSeries[n]) seriesOk = false
  }
  recordCheck(
    'Recurrence sequence terms 0..7',
    'Maths/LucasSeries.js:27-34',
    'indices 0..7',
    JSON.stringify(expectedSeries),
    JSON.stringify(actualSeries),
    seriesOk
  )
} catch (e) {
  recordCheck('Recurrence sequence', 'Maths/LucasSeries.js:27-34', '0..7', 'correct series', e.message, false)
}

// Check 5: Recurrence Invariant: L_n === L_{n-1} + L_{n-2} for n in [2..20]
try {
  let invariantOk = true
  for (let n = 2; n <= 20; n++) {
    if (lucas(n) !== lucas(n - 1) + lucas(n - 2)) {
      invariantOk = false
    }
  }
  recordCheck(
    'Recurrence invariant: L_n === L_{n-1} + L_{n-2} (n = 2..20)',
    'Maths/LucasSeries.js:27-34',
    'n in [2..20]',
    'L_n === L_{n-1} + L_{n-2} for all n',
    invariantOk ? 'Invariant held for all 19 steps' : 'Invariant broken',
    invariantOk
  )
} catch (e) {
  recordCheck('Recurrence invariant', 'Maths/LucasSeries.js:27-34', 'n in 2..20', 'invariant holds', e.message, false)
}

// Check 6: Precondition enforcement (Negative & Decimal inputs)
try {
  let threwNeg = false
  try {
    lucas(-1)
  } catch (e) {
    if (e instanceof TypeError && e.message === 'Index cannot be Negative') threwNeg = true
  }

  let threwDec = false
  try {
    lucas(3.5)
  } catch (e) {
    if (e instanceof TypeError && e.message === 'Index cannot be a Decimal') threwDec = true
  }

  const precondOk = threwNeg && threwDec
  recordCheck(
    'Precondition enforcement: Negative & Decimal guards',
    'Maths/LucasSeries.js:21,24',
    'index = -1 and index = 3.5',
    'Throws TypeError("Index cannot be Negative") and TypeError("Index cannot be a Decimal")',
    `threwNeg: ${threwNeg}, threwDec: ${threwDec}`,
    precondOk
  )
} catch (e) {
  recordCheck('Precondition enforcement', 'Maths/LucasSeries.js:21,24', 'invalid inputs', 'throws TypeErrors', e.message, false)
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

    print("=== Running Task R50-T046 Automated Checks ===")
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

    # 3. Refactoring and contract checks
    print("\n--- Refactoring & Contract Checks (Citing Source Preconditions) ---")
    refactor_res = run_refactoring_and_contract_checks(repo_root)
    for c in refactor_res.get("checks", []):
        status = "PASS" if c["passed"] else "FAIL"
        print(f"  [{status}] {c['name']}")
        print(f"         Precondition Line: {c['precondition_source_line']}")
        print(f"         Input:             {c['input']}")
        print(f"         Expected:          {c['expected']}")
        print(f"         Actual:            {c['actual']}")

    if not refactor_res.get("allPassed", False):
        print("\nERROR: Refactoring & contract checks failed.")
        sys.exit(1)

    # 4. Save results to work/R50-T046/results.json
    results_payload = {
        "task_id": "R50-T046",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "refactoring_summary": {
            "source_file": "Maths/LucasSeries.js",
            "refactoring_operation": "Replaced generic variables 'a', 'b', and 'temp' with semantic state variables 'current' (L_i) and 'next' (L_{i+1}) to clarify recurrence state transitions.",
            "negative_check_line": "21: if (index < 0) throw new TypeError('Index cannot be Negative')",
            "decimal_check_line": "24: if (Math.floor(index) !== index) throw new TypeError('Index cannot be a Decimal')"
        },
        "tools": tools,
        "native_tests": {
            "command": native_res["command"],
            "exit_code": native_res["exit_code"],
            "passed": native_res["passed"],
            "test_count": native_res["test_count"]
        },
        "contract_checks": refactor_res["checks"],
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
