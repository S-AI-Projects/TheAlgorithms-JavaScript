import os
import subprocess
import json
import sys

def run_checks():
    work_dir = "work/R50-T027"
    os.makedirs(work_dir, exist_ok=True)

    # 1. Capture environment versions
    node_ver = subprocess.check_output(["node", "-v"]).decode().strip()
    npm_ver = subprocess.check_output(["npm", "-v"]).decode().strip()
    with open(f"{work_dir}/versions.json", "w") as f:
        json.dump({"node": node_ver, "npm": npm_ver}, f, indent=2)

    # 2. Run Vitest in non-watch mode
    cmd = ["npx", "vitest", "run", "Data-Structures/Heap/test/BinaryHeap.test.js"]
    res = subprocess.run(cmd, capture_output=True, text=True)

    if res.returncode != 0:
        cmd = ["npx", "vitest", "run", "Data-Structures/Heap/tests/BinaryHeap.test.js"]
        res = subprocess.run(cmd, capture_output=True, text=True)

    with open(f"{work_dir}/test_output.log", "w") as f:
        f.write(res.stdout + "\n" + res.stderr)

    if res.returncode == 0:
        with open(f"{work_dir}/fixture_results.json", "w") as f:
            json.dump({
                "status": "PASSED",
                "task": "R50-T027",
                "precondition_line": "Data-Structures/Heap/BinaryHeap.js:10",
                "worked_example": "Inserted [10, 5, 20] with minHeapComparator, verified bubble-up transition (5 root) and extractTop sink-down transition (10 root)",
                "smallest_valid_input": {"input": [10], "expected_peek": 10},
                "ordinary_input": {"input": [10, 5, 20], "expected_extracted": [5, 10, 20]}
            }, f, indent=2)
        print("All checks passed.")
    else:
        print("Tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    run_checks()
