#!/usr/bin/env python3
"""
Focused test runner for R50-T034 (Conversions/OctToDecimal.js).
Executes new checks, propagates failures, runs repo test script in non-watch mode.
Also verifies deliberate invariant mutation failure on a temporary copy.
"""
import os
import subprocess
import sys
import tempfile
import shutil

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Support running from either work/R50-T034 or repository root
candidates = [
    os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..")),
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

def test_deliberate_mutation():
    """Verify checks fail when invariant is deliberately broken in a temporary copy."""
    print("\n--- Verifying failure on deliberately broken invariant ---")
    source_file = os.path.join(REPO_DIR, "Conversions", "OctToDecimal.js")
    backup_file = os.path.join(REPO_DIR, "Conversions", "OctToDecimal.js.bak")

    # Read original content
    with open(source_file, "r") as f:
        original = f.read()

    try:
        shutil.copyfile(source_file, backup_file)
        # Deliberately break the invariant (e.g. off-by-one or wrong base)
        mutated = original.replace("base = base * 8", "base = base * 7")
        with open(source_file, "w") as f:
            f.write(mutated)

        res = subprocess.run(
            "npx vitest run Conversions/test/OctToDecimal.test.js",
            shell=True,
            cwd=REPO_DIR,
            capture_output=True,
            text=True
        )
        if res.returncode == 0:
            print("ERROR: Deliberate mutation did NOT fail tests as expected!")
            return False
        else:
            print("Confirmed: Deliberate mutation failed tests as required.")
            return True
    finally:
        # Restore original
        if os.path.exists(backup_file):
            shutil.copyfile(backup_file, source_file)
            os.remove(backup_file)

def main():
    print("=== R50-T034 Test Runner ===")
    print(f"Repository root: {REPO_DIR}")

    # 1. Verify dependencies from lockfile
    if not os.path.exists(os.path.join(REPO_DIR, "node_modules")):
        print("Installing dependencies from lockfile...")
        res = run_cmd("npm ci")
        if res.returncode != 0:
            print("npm ci failed")
            sys.exit(res.returncode)

    # 2. Run focused check
    print("\n--- Running Focused Checks on OctToDecimal ---")
    focused_cmd = "npx vitest run Conversions/test/OctToDecimal.test.js"
    res_focused = run_cmd(focused_cmd)
    if res_focused.returncode != 0:
        print("Focused tests failed!")
        sys.exit(res_focused.returncode)

    # 3. Test deliberate mutation
    if not test_deliberate_mutation():
        print("Deliberate mutation verification failed!")
        sys.exit(1)

    # 4. Run repository test script in non-watch mode
    print("\n--- Running Full Repository Test Suite (Non-Watch Mode) ---")
    repo_cmd = "npm test"
    res_repo = run_cmd(repo_cmd)
    if res_repo.returncode != 0:
        print("Repository tests failed!")
        sys.exit(res_repo.returncode)

    print("\n=== All Checks Passed Successfully ===")

if __name__ == "__main__":
    main()

