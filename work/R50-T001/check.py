#!/usr/bin/env python3
"""Focused check runner for R50-T001.

Run from the repository root:

    python3 work/R50-T001/check.py

Steps (everything is recorded under work/R50-T001/):
  1. Record tool versions                      -> versions.txt
  2. Install dependencies from the lockfile    -> `npm ci --ignore-scripts`
     (set SKIP_INSTALL=1 to reuse an existing node_modules)
  3. Run the focused Vitest file(s) for this task; require a non-zero test
     count and zero failures                   -> vitest-focused.json
  4. Run evidence.mjs: literal fixture inputs against the real source, with
     input / expected / actual / source line   -> results.json ("fixture")
  5. Run each deliberate mutant in a temporary copy (never in the real
     source); require the named regression test to pass on the original and
     fail on the mutant                        -> results.json ("mutants")
  6. Run the repository test script in non-watch mode
     (`npm test` = `vitest run`); require a non-zero test count and zero
     failures                                  -> results.json ("full_suite")

Every command actually executed is written to commands.log. The exit status
is non-zero if any step or assertion fails (or a step times out).
"""

import json
import os
import platform
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
CONFIG = json.loads((HERE / 'task.json').read_text())
TASK = CONFIG['task']
VITEST = str(ROOT / 'node_modules' / '.bin' / 'vitest')
TIMEOUT_SECONDS = 600

failures = []
log = []


def show(text):
    """Hide machine-specific absolute paths in recorded evidence."""
    text = text.replace(str(ROOT) + os.sep, '').replace(str(ROOT), '.')
    return text.replace(tempfile.gettempdir(), '$TMPDIR')


def run(cmd, cwd=ROOT, check=False):
    """Run a command, log it exactly, and never wait forever."""
    shown = show(' '.join(cmd))
    log.append('$ ' + shown)
    try:
        proc = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True,
                              timeout=TIMEOUT_SECONDS)
    except subprocess.TimeoutExpired:
        log.append(f'  -> timed out after {TIMEOUT_SECONDS}s')
        failures.append(f'timed out: {shown}')
        return subprocess.CompletedProcess(cmd, 124, '', 'timeout')
    log.append(f'  -> exit {proc.returncode}')
    if check and proc.returncode != 0:
        print(proc.stdout[-4000:])
        print(proc.stderr[-4000:], file=sys.stderr)
    return proc


def version(cmd):
    try:
        return run(cmd).stdout.strip().splitlines()[0]
    except Exception as exc:  # best effort only
        return f'unavailable ({exc})'


def test_list(report):
    return [
        {'name': t.get('fullName') or t.get('title'), 'status': t.get('status')}
        for suite in report.get('testResults', [])
        for t in suite.get('assertionResults', [])
    ]


def read_report(proc, out):
    if not out.exists():
        print(proc.stdout[-4000:])
        print(proc.stderr[-4000:], file=sys.stderr)
        return None
    report = json.loads(out.read_text())
    out.unlink()
    return report


def summary(cmd, proc, report):
    return {
        'command': show(' '.join(cmd)),
        'exit': proc.returncode,
        'total': report and report['numTotalTests'],
        'passed': report and report['numPassedTests'],
        'failed': report and report['numFailedTests']
    }


def require_green(label, info, report):
    if info['exit'] != 0 or not report or report['numTotalTests'] == 0 or \
            report['numFailedTests'] != 0:
        failures.append(f'{label} failed: {info}')
        if report:
            failures.extend('  failed: ' + t['name']
                            for t in test_list(report)
                            if t['status'] == 'failed')


def main():
    results = {'task': TASK}

    # 1. Tool versions
    versions = {
        'python': platform.python_version(),
        'node': version(['node', '--version']),
        'npm': version(['npm', '--version']),
        'platform': platform.platform()
    }

    # 2. Install from the lockfile
    if os.environ.get('SKIP_INSTALL') == '1':
        results['install'] = 'skipped (SKIP_INSTALL=1)'
    else:
        cmd = ['npm', 'ci', '--ignore-scripts', '--no-audit', '--no-fund']
        proc = run(cmd, check=True)
        results['install'] = {'command': ' '.join(cmd),
                              'exit': proc.returncode}
        if proc.returncode != 0:
            failures.append('npm ci failed')
            return finish(results, versions)
    versions['vitest'] = version([VITEST, '--version'])

    # 3. Focused tests
    out = HERE / 'vitest-focused.raw.json'
    cmd = [VITEST, 'run', *CONFIG['focused_tests'], '--reporter=json',
           f'--outputFile={out}']
    proc = run(cmd)
    focused_report = read_report(proc, out)
    results['focused_tests'] = summary(cmd, proc, focused_report)
    require_green('focused tests', results['focused_tests'], focused_report)
    if focused_report:
        (HERE / 'vitest-focused.json').write_text(json.dumps({
            'command': results['focused_tests']['command'],
            'numTotalTests': focused_report['numTotalTests'],
            'numPassedTests': focused_report['numPassedTests'],
            'numFailedTests': focused_report['numFailedTests'],
            'tests': test_list(focused_report)
        }, indent=2) + '\n')

    # 4. Fixture evidence (input / expected / actual / source line)
    proc = run(['node', str(HERE / 'evidence.mjs')])
    rows = []
    if proc.returncode != 0:
        failures.append('evidence.mjs crashed: ' + show(proc.stderr[-2000:]))
    else:
        rows = json.loads(proc.stdout)
    results['fixture'] = rows
    for row in rows:
        print(f"[{'PASS' if row['pass'] else 'FAIL'}] {row['name']}")
        print(f"       input:    {json.dumps(row['input'])}")
        print(f"       expected: {json.dumps(row['expected'])}")
        print(f"       actual:   {json.dumps(row['actual'])}")
        if row.get('precondition'):
            print(f"       source:   {row['precondition']}")
        if not row['pass']:
            failures.append(f"fixture mismatch: {row['name']}")
    if not rows:
        failures.append('no fixture rows were produced')

    # 5. Deliberate mutants, in temporary copies only
    original_tests = test_list(focused_report) if focused_report else []
    mutants = [run_mutant(m, original_tests) for m in CONFIG.get('mutants', [])]
    if mutants:
        results['mutants'] = mutants

    # 6. Repository test script in non-watch mode: `npm test` (vitest run)
    out = HERE / 'vitest-full.raw.json'
    cmd = ['npm', 'test', '--', '--reporter=json', f'--outputFile={out}']
    proc = run(cmd)
    full_report = read_report(proc, out)
    results['full_suite'] = summary(cmd, proc, full_report)
    require_green('repository test script', results['full_suite'], full_report)

    return finish(results, versions)


def run_mutant(mutant, original_tests):
    """Copy the source and its tests into a temp dir, apply one edit there,
    and require the named test to pass on the original and fail here."""
    original = (ROOT / mutant['file']).read_text()
    named = [t for t in original_tests if mutant['must_fail'] in t['name']]
    entry = {
        'name': mutant['name'],
        'file': mutant['file'],
        'edit': {'from': mutant['find'], 'to': mutant['replace']},
        'named_test': mutant['must_fail'],
        'named_test_on_original': [t['status'] for t in named],
        'killed': False
    }
    if len(named) != 1 or named[0]['status'] != 'passed':
        failures.append(f"mutant {mutant['name']}: named test must match "
                        f"exactly one passing test on the original")
        return entry
    if original.count(mutant['find']) != 1:
        failures.append(f"mutant {mutant['name']}: edit must match once")
        return entry
    with tempfile.TemporaryDirectory(prefix=f'{TASK}-mutant-') as tmp:
        tmp = Path(tmp)
        for rel in [mutant['file'], *mutant['tests']]:
            dest = tmp / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy(ROOT / rel, dest)
        (tmp / mutant['file']).write_text(
            original.replace(mutant['find'], mutant['replace']))
        out = tmp / 'mutant-report.json'
        cmd = [VITEST, 'run', *mutant['tests'], '--root', str(tmp),
               '--globals', '--reporter=json', f'--outputFile={out}']
        proc = run(cmd)
        report = read_report(proc, out)
    failed = [t['name'] for t in test_list(report)
              if t['status'] == 'failed'] if report else []
    entry['exit'] = proc.returncode
    entry['failed_tests_on_mutant'] = failed
    entry['killed'] = proc.returncode != 0 and any(
        mutant['must_fail'] in name for name in failed)
    print(f"[{'KILLED' if entry['killed'] else 'SURVIVED'}] mutant "
          f"{mutant['name']}: {mutant['find']!r} -> {mutant['replace']!r}")
    for name in failed:
        print(f'       failed: {name}')
    if not entry['killed']:
        failures.append(f"mutant {mutant['name']} was not detected by "
                        f"'{mutant['must_fail']}'")
    return entry


def finish(results, versions):
    results['ok'] = not failures
    results['failures'] = failures
    (HERE / 'versions.txt').write_text(
        ''.join(f'{k}: {v}\n' for k, v in versions.items()))
    (HERE / 'results.json').write_text(json.dumps(results, indent=2) + '\n')
    (HERE / 'commands.log').write_text('\n'.join(log) + '\n')
    print()
    for key, label in [('focused_tests', 'focused tests'),
                       ('full_suite', 'npm test')]:
        if key in results:
            info = results[key]
            print(f"{label + ':':15}{info['passed']}/{info['total']} passed"
                  f"  ({info['command']})")
    if failures:
        print('\nFAILED:')
        for item in failures:
            print('  - ' + item)
        return 1
    print(f'\n{TASK}: all checks passed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
