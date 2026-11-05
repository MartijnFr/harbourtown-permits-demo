# Instructions for coding agents

Harbourtown is a fictional municipality. This repository holds its parking-permit
service: `permits/src/permits.ts`, with the municipal register and the vehicle
register in `permits/src/registers.ts`. All people, addresses and plates are invented.

## Work

- Work from the spec in `specs/` that you were given. Read the rest of the repository only to do what it says.
- Before you change code, list your assumptions about anything the spec leaves open.
- Run `npm run check` (typecheck and tests) before you say you are done.
- Amounts are in euro cents; dates are ISO days (`2026-11-02`).

## Decision rights

The team fills this in. An agent follows it.

| Action | Alone | After review | Never |
| ------ | ----- | ------------ | ----- |
|        |       |              |       |

## Never

- Change `test/acceptance/`: the product owner owns those examples.
