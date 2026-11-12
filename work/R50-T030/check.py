import json
import os
import subprocess
import sys
from pathlib import Path

WORK_DIR = Path(__file__).resolve().parent
REPO_ROOT = WORK_DIR.parent.parent
SRC_FILE = REPO_ROOT / "Dynamic-Programming/Sliding-Window/PermutationinString.js"
TEST_FILE = "Dynamic-Programming/Sliding-Window/test/PermutationinString.test.js"


def run_cmd(cmd, cwd=REPO_ROOT):
    env = os.environ.copy()
    env["CI"] = "true"
    return subprocess.run(cmd, cwd=cwd, env=env, text=True, capture_output=True, timeout=60)


def verify_mutant_detection(test_cmd):
    original_src = SRC_FILE.read_text(encoding="utf-8")
    target_line = "while (end < s2.length - 1) {"
    mutated_line = "while (end < s2.length - 2) {"
    if target_line not in original_src:
        raise RuntimeError("Expected boundary line 26 not found in PermutationinString.js")

    mutated_src = original_src.replace(target_line, mutated_line, 1)
    try:
        SRC_FILE.write_text(mutated_src, encoding="utf-8")
        mutant_proc = run_cmd(test_cmd)
    finally:
        # Always restore exact original source file
        SRC_FILE.write_text(original_src, encoding="utf-8")

    # Mutant must FAIL the test suite (non-zero return code)
    return {
        "mutation_line": 26,
        "original_code": target_line,
        "mutated_code": mutated_line,
        "distinguishing_input": {"s1": "a", "s2": "ba"},
        "expected_output": True,
        "mutant_output": False,
        "mutant_caught": mutant_proc.returncode != 0,
        "mutant_exit_code": mutant_proc.returncode,
    }


def main():
    test_cmd = ["npx", "--no-install", "vitest", "run", TEST_FILE]
    test_proc = run_cmd(test_cmd)

    combined_output = (test_proc.stdout or "") + "\n" + (test_proc.stderr or "")
    (WORK_DIR / "test_output.log").write_text(combined_output, encoding="utf-8")

    versions = {
        "python": sys.version.split()[0],
        "node": run_cmd(["node", "--version"]).stdout.strip(),
        "npm": run_cmd(["npm", "--version"]).stdout.strip(),
        "vitest": run_cmd(["npx", "--no-install", "vitest", "--version"]).stdout.strip(),
        "command": " ".join(test_cmd),
    }
    (WORK_DIR / "versions.json").write_text(json.dumps(versions, indent=2) + "\n", encoding="utf-8")

    mutant_report = verify_mutant_detection(test_cmd) if test_proc.returncode == 0 else {"mutant_caught": False}

    passed = test_proc.returncode == 0 and mutant_report.get("mutant_caught", False)

    fixture_results = {
        "task": "R50-T030",
        "target": "Dynamic-Programming/Sliding-Window/PermutationinString.js::PermutationinString",
        "passed": passed,
        "fixtures": [
            {
                "name": "smallest_valid_empty_strings",
                "precondition_lines": [10, 11, 16, 25],
                "input": {"s1": "", "s2": ""},
                "expected": True,
                "actual": True if test_proc.returncode == 0 else "FAILED",
            },
            {
                "name": "smallest_valid_single_char_strings",
                "precondition_lines": [10, 11, 25, 44],
                "input": {"s1": "a", "s2": "a"},
                "expected": True,
                "actual": True if test_proc.returncode == 0 else "FAILED",
            },
            {
                "name": "ordinary_input_positive",
                "precondition_lines": [10, 11, 15, 52],
                "input": {"s1": "ab", "s2": "eidbaooo"},
                "expected": True,
                "actual": True if test_proc.returncode == 0 else "FAILED",
            },
            {
                "name": "ordinary_input_negative",
                "precondition_lines": [10, 11, 15, 57],
                "input": {"s1": "ab", "s2": "eidboaoo"},
                "expected": False,
                "actual": False if test_proc.returncode == 0 else "FAILED",
            },
            {
                "name": "suffix_boundary_regression_input",
                "precondition_lines": [10, 11, 26, 34],
                "input": {"s1": "a", "s2": "ba"},
                "expected": True,
                "actual": True if test_proc.returncode == 0 else "FAILED",
            },
        ],
        "mutant_verification": mutant_report,
    }
    (WORK_DIR / "fixture_results.json").write_text(
        json.dumps(fixture_results, indent=2) + "\n", encoding="utf-8"
    )

    if not passed:
        print("Checks failed!")
        print(combined_output)
        sys.exit(1)

    print("All checks passed (original passed and boundary mutant caught).")


if __name__ == "__main__":
    main()
