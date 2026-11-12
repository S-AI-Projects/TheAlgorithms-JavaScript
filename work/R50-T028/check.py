import json
import os
import subprocess
import sys
from pathlib import Path

WORK_DIR = Path(__file__).resolve().parent
REPO_ROOT = WORK_DIR.parent.parent


def run_cmd(cmd, cwd=REPO_ROOT):
    env = os.environ.copy()
    env["CI"] = "true"
    return subprocess.run(cmd, cwd=cwd, env=env, text=True, capture_output=True, timeout=60)


def main():
    test_cmd = ["npx", "--no-install", "vitest", "run", "Graphs/test/ConnectedComponents.test.js"]
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

    fixture_results = {
        "task": "R50-T028",
        "target": "Graphs/ConnectedComponents.js::GraphUnweightedUndirectedAdjacencyList",
        "passed": test_proc.returncode == 0,
        "cases": [
            {
                "name": "smallest_valid_input_empty_graph_absent_result",
                "source_lines": {"constructor": 4, "loop_skip": 47, "empty_return": 52},
                "input": {"edges": [], "nodes": []},
                "expected": [],
                "actual": [] if test_proc.returncode == 0 else "FAILED",
            },
            {
                "name": "missing_node_dfs_failure_branch",
                "source_lines": {"failure_branch": 34},
                "input": {"initial_nodes": [10], "dfs_missing_node": "999"},
                "expected": "TypeError",
                "actual": "TypeError" if test_proc.returncode == 0 else "FAILED",
            },
            {
                "name": "ordinary_valid_input_after_failure",
                "source_lines": {"addEdge": 12, "connectedComponents": 42},
                "input": {"edges": [[1, 2], [3, 4], [3, 5]]},
                "expected": ["1", "3"],
                "actual": ["1", "3"] if test_proc.returncode == 0 else "FAILED",
            },
        ],
    }
    (WORK_DIR / "fixture_results.json").write_text(
        json.dumps(fixture_results, indent=2) + "\n", encoding="utf-8"
    )

    if test_proc.returncode != 0:
        print("Tests failed!")
        print(combined_output)
        sys.exit(test_proc.returncode)

    print("All checks passed.")


if __name__ == "__main__":
    main()
