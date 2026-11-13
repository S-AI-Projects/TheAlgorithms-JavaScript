#!/usr/bin/env python3
"""
Test runner for R50-T032: Maths/DecimalIsolate.js boundary and contract checks.
Ensures repository tests execute in non-watch mode after lockfile installation.
Exits with non-zero status if any assertion or test fails.
"""

import os
import subprocess
import sys

# Locate TheAlgorithms-JavaScript directory relative to this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Check whether running from /Users/aniket/project/work/R50-T032 or /Users/aniket/project/TheAlgorithms-JavaScript/work/R50-T032
if os.path.exists(os.path.join(SCRIPT_DIR, "..", "..", "TheAlgorithms-JavaScript", "package.json")):
    REPO_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", "TheAlgorithms-JavaScript"))
elif os.path.exists(os.path.join(SCRIPT_DIR, "..", "package.json")):
    REPO_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
elif os.path.exists(os.path.join(SCRIPT_DIR, "..", "..", "package.json")):
    REPO_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
else:
    REPO_DIR = "/Users/aniket/project/TheAlgorithms-JavaScript"

def run_cmd(cmd, cwd=REPO_DIR):
    print(f"[RUN] {cmd} (cwd: {cwd})")
    res = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    if res.stdout:
        print(res.stdout)
    if res.stderr:
        print(res.stderr, file=sys.stderr)
    return res

def main():
    print("=== R50-T032 Test Runner ===")
    print(f"Repository Root: {REPO_DIR}")
    
    # 1. Verify dependencies installed from lockfile
    if not os.path.exists(os.path.join(REPO_DIR, "node_modules")):
        print("node_modules not found, installing from lockfile...")
        install_res = run_cmd("npm ci")
        if install_res.returncode != 0:
            print("ERROR: npm ci failed")
            sys.exit(install_res.returncode)

    # 2. Run focused check on DecimalIsolate test file (non-watch mode)
    print("\n--- Running Focused Boundary Tests for DecimalIsolate ---")
    focused_cmd = "npx vitest run Maths/test/DecimalIsolate.test.js"
    focused_res = run_cmd(focused_cmd)
    
    # 3. Check failure propagation
    if focused_res.returncode != 0:
        print(f"FAILED: Focused tests exited with code {focused_res.returncode}")
        sys.exit(focused_res.returncode)

    print("\n--- Running Entire Repository Test Suite (Non-Watch Mode) ---")
    repo_test_cmd = "npm test"
    repo_res = run_cmd(repo_test_cmd)
    if repo_res.returncode != 0:
        print(f"FAILED: Repository tests exited with code {repo_res.returncode}")
        sys.exit(repo_res.returncode)

    print("\n=== All Tests Passed Successfully ===")

if __name__ == "__main__":
    main()
