#!/usr/bin/env python3
"""
Focused test runner for R50-T033 (Maths/ExponentialFunction.js).
Executes new checks, propagates failures, runs repo test script in non-watch mode.
"""
import os
import subprocess
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Support running from either /project/work/R50-T033 or /project/TheAlgorithms-JavaScript/work/R50-T033
candidates = [
    os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..")),
    os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", "TheAlgorithms-JavaScript")),
    "/Users/aniket/project/TheAlgorithms-JavaScript",
]
REPO_DIR = next((c for c in candidates if os.path.exists(os.path.join(c, "package.json"))), candidates[-1])

def run_cmd(cmd, cwd=REPO_DIR):
    print(f"[RUN] {cmd} (cwd: {cwd})")
    res = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    if res.stdout:
        print(res.stdout)
    if res.stderr:
        print(res.stderr, file=sys.stderr)
    return res

def main():
    print("=== R50-T033 Test Runner ===")
    print(f"Repository root: {REPO_DIR}")

    # 1. Verify dependencies from lockfile
    if not os.path.exists(os.path.join(REPO_DIR, "node_modules")):
        print("Installing dependencies from lockfile...")
        res = run_cmd("npm ci")
        if res.returncode != 0:
            print("npm ci failed")
            sys.exit(res.returncode)

    # 2. Run focused check
    print("\n--- Running Focused Checks on ExponentialFunction ---")
    focused_cmd = "npx vitest run Maths/test/ExponentialFunction.test.js"
    res_focused = run_cmd(focused_cmd)
    if res_focused.returncode != 0:
        print("Focused tests failed!")
        sys.exit(res_focused.returncode)

    # 3. Run repository test script in non-watch mode
    print("\n--- Running Full Repository Test Suite (Non-Watch Mode) ---")
    repo_cmd = "npm test"
    res_repo = run_cmd(repo_cmd)
    if res_repo.returncode != 0:
        print("Repository tests failed!")
        sys.exit(res_repo.returncode)

    print("\n=== All Checks Passed Successfully ===")

if __name__ == "__main__":
    main()
