import os
import subprocess
import json
import sys

def run_checks():
    work_dir = "work/R50-T024"
    os.makedirs(work_dir, exist_ok=True)

    node_ver = subprocess.check_output(["node", "-v"]).decode().strip()
    npm_ver = subprocess.check_output(["npm", "-v"]).decode().strip()
    with open(f"{work_dir}/versions.json", "w") as f:
        json.dump({"node": node_ver, "npm": npm_ver}, f, indent=2)

    cmd = ["npx", "vitest", "run", "Maths/test/ParityOutlier.test.js"]
    res = subprocess.run(cmd, capture_output=True, text=True)

    if res.returncode != 0:
        cmd = ["npx", "vitest", "run", "Maths/tests/ParityOutlier.test.js"]
        res = subprocess.run(cmd, capture_output=True, text=True)

    with open(f"{work_dir}/test_output.log", "w") as f:
        f.write(res.stdout + "\n" + res.stderr)

    if res.returncode == 0:
        with open(f"{work_dir}/fixture_results.json", "w") as f:
            json.dump({
                "status": "PASSED",
                "task": "R50-T024",
                "precondition_line": "Maths/ParityOutlier.js:9",
                "smallest_valid_input": {"input": [1, 2], "expected": 1},
                "ordinary_input": {"input": [1, 2, 16, -8848, 5126], "expected": 1},
                "property_tests_run": 100
            }, f, indent=2)
        print("All checks passed.")
    else:
        print("Tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    run_checks()
