# Harbourtown parking permits

The parking-permit service of Harbourtown, a fictional municipality. Residents
request a permit for their own vehicle; it is valid for 12 months once paid. An
address has at most two permits, and the second costs more.

For the capstone, fill the [move-permit draft](specs/move-permit.md). The
[spec guide](specs/README.md) includes the fixture data, API and a test to copy
and adapt to your own acceptance criterion.

## Work in the browser

Nothing needs to be installed.

- **Read and edit:** on the repository page, press `.` to open it in
  github.dev, or open it in vscode.dev. Commit from there.
- **The agent:** a cloud coding agent works on the repository and opens a pull
  request. It runs the checks in its own environment.
- **The checks:** GitHub Actions runs two checks on every pull request and on
  `main`. "npm run check" runs the typecheck and the tests in the test
  script. "Acceptance examples" always runs `test/acceptance/`.

## Where things are

| Path                           | Contents                                                   |
| ------------------------------ | ---------------------------------------------------------- |
| `permits/src/`                 | The service and the two registers, with invented data      |
| `permits/test/`                | The developers' tests                                      |
| `test/acceptance/`             | The product owner's examples: what "correct" means         |
| `specs/`                       | One spec per change, for the agent                         |
| `AGENTS.md`                    | Instructions every coding agent reads, and decision rights |
| `RELEASES.md`                  | Release notes, with who approved each change               |
| `.github/workflows/checks.yml` | The two checks                                             |

`CLAUDE.md` points to `AGENTS.md`, so agents that read either file get the same instructions.
