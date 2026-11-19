#!/usr/bin/env python3
"""Focused, repeatable checks for R50-T014."""
import subprocess
import sys

command = ["npx", "vitest", "run", "Sorts/test/SimplifiedWiggleSort.test.js"]
print("Python:", sys.version.split()[0])
print("Node:", subprocess.check_output(["node", "--version"], text=True).strip())
print("Command:", " ".join(command))
result = subprocess.run(command)
if result.returncode:
    raise SystemExit(result.returncode)
full_suite = subprocess.run(["npm", "test"], text=True)
if full_suite.returncode:
    raise SystemExit(full_suite.returncode)
mutation = subprocess.run(["node", "work/R50-T014/mutation-check.mjs"], capture_output=True, text=True)
print(mutation.stdout)
if mutation.returncode:
    print(mutation.stderr, file=sys.stderr)
    raise SystemExit(mutation.returncode)

