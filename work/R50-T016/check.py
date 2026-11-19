#!/usr/bin/env python3
"""Focused, repeatable checks for R50-T016."""
import subprocess
import sys

command = ["npx", "vitest", "run", "Sorts/test/IntroSort.test.js"]
print("Python:", sys.version.split()[0])
print("Node:", subprocess.check_output(["node", "--version"], text=True).strip())
print("Command:", " ".join(command))
result = subprocess.run(command)
if result.returncode:
    raise SystemExit(result.returncode)
full_suite = subprocess.run(["npm", "test"], text=True)
if full_suite.returncode:
    raise SystemExit(full_suite.returncode)

