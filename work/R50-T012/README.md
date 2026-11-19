# R50-T012 evidence — TopologicalSorter boundaries

`TopologicalSorter` adds both endpoint strings when `addOrder` is called (source lines 13-17). The empty graph has no nodes; the smallest graph has one edge and two nodes. For acyclic graphs, every predecessor appears before its successor. Cycle handling is not documented as an error.

| Input edges                          | Expected order or guarantee  | Observed result                  |
| ------------------------------------ | ---------------------------- | -------------------------------- |
| none                                 | `[]`                         | `[]`                             |
| `first -> second`                    | `['first', 'second']`        | `['first', 'second']`            |
| `compile -> test`, `test -> package` | predecessor before successor | `['compile', 'test', 'package']` |
| `source -> sink`                     | sink included after source   | `['source', 'sink']`             |

- Focused tests: `Sorts/test/TopologicalSort.test.js`.
- Verification command: `python3 work/R50-T012/check.py` (focused Vitest, then full non-watch `npm test`).
- Result: focused 4 tests passed; full suite 347 files and 11,974 tests passed.
- Tools: Python 3.15.2, Node.js v26.12.1, Vitest 1.2.1.
