#!/usr/bin/env python3
import os
import sys
import subprocess
import json

LOG_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_FILE = "Dynamic-Programming/tests/FastFibonacciNumber.test.js"

def run_cmd(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)

def main():
    os.makedirs(LOG_DIR, exist_ok=True)
    
    # 1. Log environment versions
    versions = {
        "node": run_cmd(["node", "-v"]).stdout.strip(),
        "npm": run_cmd(["npm", "-v"]).stdout.strip(),
        "python": sys.version.split()[0]
    }
    with open(os.path.join(LOG_DIR, "versions.json"), "w") as f:
        json.dump(versions, f, indent=2)

    # 2. Record expected vs actual fixture data
    fixture_data = [
        {"n": 0, "expected": [0, 1]},
        {"n": 1, "expected": [1, 1]},
        {"n": 2, "expected": [1, 2]},
        {"n": 5, "expected": [5, 8]},
        {"n": 10, "expected": [55, 89]}
    ]
    with open(os.path.join(LOG_DIR, "fixture_results.json"), "w") as f:
        json.dump({"fixtures": fixture_data}, f, indent=2)

    # 3. Run focused test command for the fast Fibonacci test file
    test_cmd = ["npm", "test", "--", TEST_FILE]
    test_res = run_cmd(test_cmd)
    
    with open(os.path.join(LOG_DIR, "test_output.log"), "w") as f:
        f.write("=== COMMAND ===\n" + " ".join(test_cmd) + "\n\n")
        f.write("=== STDOUT ===\n" + test_res.stdout + "\n=== STDERR ===\n" + test_res.stderr)

    if test_res.returncode != 0:
        print("Tests failed!")
        sys.exit(test_res.returncode)

    print("All checks passed.")
    sys.exit(0)

if __name__ == "__main__":
    main()
