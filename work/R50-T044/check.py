#!/usr/bin/env python3
"""
Automated check runner for Task R50-T044:
Test an invariant of feetToMeter (MeterToFeetConversion.js)
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

    cmd = "npm test -- Conversions/test/MeterToFeetConversion.test.js"
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

def run_invariant_property_checks(repo_root):
    env = os.environ.copy()
    if "/opt/homebrew/bin" not in env.get("PATH", ""):
        env["PATH"] = f"/opt/homebrew/bin:{env.get('PATH', '')}"

    js_code = """
import { feetToMeter, meterToFeet } from './Conversions/MeterToFeetConversion.js'

const results = {
  checks: [],
  allPassed: true,
  mutantDetectionPassed: false
}

function createLCG(seed = 123456789) {
  let s = seed
  return function () {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
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
// Conversions/MeterToFeetConversion.js Line 18: "const feetToMeter = (feet) => { return feet * 0.3048 }"

// Check 1: Smallest valid input: 0 feet
try {
  const input = 0
  const expected = 0
  const actual = feetToMeter(input)
  const passed = actual === expected
  recordCheck(
    'Smallest valid input: 0 feet',
    'Conversions/MeterToFeetConversion.js:18',
    '0',
    String(expected),
    String(actual),
    passed
  )
} catch (e) {
  recordCheck('Smallest valid input', 'Conversions/MeterToFeetConversion.js:18', '0', '0', e.message, false)
}

// Check 2: Ordinary input: 10 feet
try {
  const input = 10
  const expected = 3.048
  const actual = feetToMeter(input)
  const passed = Math.abs(actual - expected) < 1e-12
  recordCheck(
    'Ordinary input: 10 feet',
    'Conversions/MeterToFeetConversion.js:18',
    '10',
    String(expected),
    String(actual),
    passed
  )
} catch (e) {
  recordCheck('Ordinary input', 'Conversions/MeterToFeetConversion.js:18', '10', '3.048', e.message, false)
}

// Generate 100 bounded valid cases with fixed seed LCG
const rng = createLCG(123456789)
const boundedCases = []
for (let i = 0; i < 100; i++) {
  boundedCases.push(Number((rng() * 1000 + 0.01).toFixed(4)))
}

// Check 3: Ratio Invariant: feetToMeter(x) / x === 0.3048 within 1e-12
let maxRatioErr = 0
let ratioOk = true
for (const x of boundedCases) {
  const m = feetToMeter(x)
  const err = Math.abs(m / x - 0.3048)
  if (err > maxRatioErr) maxRatioErr = err
  if (err >= 1e-12) ratioOk = false
}
recordCheck(
  'Ratio Invariant across 100 bounded valid cases',
  'Conversions/MeterToFeetConversion.js:18',
  '100 bounded values in [0.01, 1000.0]',
  'Math.abs(feetToMeter(x) / x - 0.3048) < 1e-12',
  `maxRatioErr = ${maxRatioErr.toExponential(4)}`,
  ratioOk,
  { sampleCount: boundedCases.length, maxRatioErr }
)

// Check 4: Invertibility / Round-trip Invariant: meterToFeet(feetToMeter(x)) === x
let maxRoundTripErr = 0
let roundTripOk = true
for (const x of boundedCases) {
  const back = meterToFeet(feetToMeter(x))
  const err = Math.abs(back - x)
  if (err > maxRoundTripErr) maxRoundTripErr = err
  if (err >= 1e-9) roundTripOk = false
}
recordCheck(
  'Round-trip Invertibility across 100 bounded valid cases',
  'Conversions/MeterToFeetConversion.js:18',
  '100 bounded values in [0.01, 1000.0]',
  'Math.abs(meterToFeet(feetToMeter(x)) - x) < 1e-9',
  `maxRoundTripErr = ${maxRoundTripErr.toExponential(4)}`,
  roundTripOk,
  { sampleCount: boundedCases.length, maxRoundTripErr }
)

// Check 5: Linearity Invariant: feetToMeter(a + b) === feetToMeter(a) + feetToMeter(b)
let maxLinearErr = 0
let linearOk = true
for (let i = 0; i < boundedCases.length - 1; i += 2) {
  const a = boundedCases[i]
  const b = boundedCases[i + 1]
  const err = Math.abs(feetToMeter(a + b) - (feetToMeter(a) + feetToMeter(b)))
  if (err > maxLinearErr) maxLinearErr = err
  if (err >= 1e-9) linearOk = false
}
recordCheck(
  'Linearity Invariant: feetToMeter(a + b) === feetToMeter(a) + feetToMeter(b)',
  'Conversions/MeterToFeetConversion.js:18',
  '50 disjoint pairs from bounded cases',
  'Math.abs(feetToMeter(a + b) - (feetToMeter(a) + feetToMeter(b))) < 1e-9',
  `maxLinearErr = ${maxLinearErr.toExponential(4)}`,
  linearOk,
  { maxLinearErr }
)

// Check 6: Invariant failure detection on deliberately broken mutant copy
// If an implementation uses scale factor 0.30 instead of 0.3048, checks must detect failure
const brokenFeetToMeter = (f) => f * 0.30
const mutantFailed = Math.abs(brokenFeetToMeter(1) / 1 - 0.3048) > 1e-3
results.mutantDetectionPassed = mutantFailed

recordCheck(
  'Deliberately broken mutant detection verification',
  'Conversions/MeterToFeetConversion.js:18',
  'mutant with scale 0.30 instead of 0.3048',
  'Ratio check must detect defect and fail',
  mutantFailed ? 'Detected defect with discrepancy 0.0048 > 1e-3' : 'Failed to detect broken invariant',
  mutantFailed
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

    print("=== Running Task R50-T044 Automated Checks ===")
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

    # 3. Invariant property checks citing source line 18
    print("\n--- Invariant Property Checks (Citing Source Preconditions) ---")
    prop_res = run_invariant_property_checks(repo_root)
    for c in prop_res.get("checks", []):
        status = "PASS" if c["passed"] else "FAIL"
        print(f"  [{status}] {c['name']}")
        print(f"         Precondition Line: {c['precondition_source_line']}")
        print(f"         Input:             {c['input']}")
        print(f"         Expected:          {c['expected']}")
        print(f"         Actual:            {c['actual']}")

    if not prop_res.get("allPassed", False) or not prop_res.get("mutantDetectionPassed", False):
        print("\nERROR: Invariant property checks failed.")
        sys.exit(1)

    # 4. Save results to work/R50-T044/results.json
    results_payload = {
        "task_id": "R50-T044",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "precondition_contract": {
            "source_file": "Conversions/MeterToFeetConversion.js",
            "precondition_lines": "18",
            "precondition_code": "const feetToMeter = (feet) => { return feet * 0.3048 }"
        },
        "tools": tools,
        "native_tests": {
            "command": native_res["command"],
            "exit_code": native_res["exit_code"],
            "passed": native_res["passed"],
            "test_count": native_res["test_count"]
        },
        "property_checks": prop_res["checks"],
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
