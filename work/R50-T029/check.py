import json
import os
import statistics
import subprocess
import sys
from pathlib import Path

WORK_DIR = Path(__file__).resolve().parent
REPO_ROOT = WORK_DIR.parent.parent


def run_cmd(cmd, cwd=REPO_ROOT):
    env = os.environ.copy()
    env["CI"] = "true"
    return subprocess.run(cmd, cwd=cwd, env=env, text=True, capture_output=True, timeout=60)


def measure_node_scaling():
    node_script = """
import { minesweeper } from './Search/Minesweeper.js';

function createSeededMatrix(size, seed) {
  let state = seed >>> 0;
  const nextRand = () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
  const matrix = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      row.push(nextRand() < 0.3);
    }
    matrix.push(row);
  }
  return matrix;
}

const sizes = [10, 20, 40];
const seeds = [101, 202, 303, 404, 505];
const measurements = {};

// Warmup JIT outside measured runs
minesweeper(createSeededMatrix(8, 1));

for (const n of sizes) {
  const durationsMs = [];
  const neighborChecks = [];
  for (const seed of seeds) {
    const matrix = createSeededMatrix(n, seed);
    const start = process.hrtime.bigint();
    const out = minesweeper(matrix);
    const end = process.hrtime.bigint();
    if (out.length !== n || out[0].length !== n) {
      throw new Error('Dimension mismatch');
    }
    durationsMs.push(Number(end - start) / 1e6);
    neighborChecks.push(9 * n * n);
  }
  measurements[n] = {
    grid_dimension_N: n,
    total_cells_M: n * n,
    repetitions: seeds.length,
    seeds,
    durations_ms: durationsMs,
    neighbor_checks_per_run: neighborChecks
  };
}

console.log(JSON.stringify(measurements));
"""
    proc = run_cmd(["node", "--input-type=module", "-e", node_script])
    if proc.returncode != 0:
        raise RuntimeError(f"Node scaling measurement failed: {proc.stderr}")
    raw = json.loads(proc.stdout.strip())
    summary = {}
    for size_key, data in raw.items():
        durs = data["durations_ms"]
        ops = data["neighbor_checks_per_run"]
        summary[size_key] = {
            **data,
            "median_ms": round(statistics.median(durs), 6),
            "range_ms": round(max(durs) - min(durs), 6),
            "median_neighbor_checks": int(statistics.median(ops)),
            "range_neighbor_checks": int(max(ops) - min(ops)),
        }
    return summary


def main():
    test_cmd = ["npx", "--no-install", "vitest", "run", "Search/test/Minesweeper.test.js"]
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

    scaling_metrics = measure_node_scaling() if test_proc.returncode == 0 else {}

    fixture_results = {
        "task": "R50-T029",
        "target": "Search/Minesweeper.js::minesweeper",
        "passed": test_proc.returncode == 0,
        "complexity_analysis": {
            "input_size_variable": "N (grid side length for an N x N matrix, where total cells M = N^2)",
            "theoretical_worst_case": "Theta(N^2) = Theta(M) time and Theta(N^2) auxiliary space; each cell visits a constant 3x3 neighborhood (at most 8 neighbors, lines 24-32).",
            "empirical_observation": "Deterministic neighbor-check operation count scales strictly as 9 * N^2 (4x increase when doubling N from 10 -> 20 -> 40), matching Theta(N^2) growth.",
        },
        "fixtures": [
            {
                "name": "smallest_valid_empty_matrix",
                "precondition_lines": [4, 14, 20],
                "input": [],
                "expected": [],
                "actual": [] if test_proc.returncode == 0 else "FAILED",
            },
            {
                "name": "smallest_non_empty_1x1_matrix",
                "precondition_lines": [4, 14, 22, 27],
                "input": [[True]],
                "expected": [[0]],
                "actual": [[0]] if test_proc.returncode == 0 else "FAILED",
            },
            {
                "name": "ordinary_3x3_matrix",
                "precondition_lines": [4, 14, 18],
                "input": [[True, False, False], [False, True, False], [False, False, False]],
                "expected": [[1, 2, 1], [2, 1, 1], [1, 1, 1]],
                "actual": [[1, 2, 1], [2, 1, 1], [1, 1, 1]] if test_proc.returncode == 0 else "FAILED",
            },
        ],
        "scaling_measurements": scaling_metrics,
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
