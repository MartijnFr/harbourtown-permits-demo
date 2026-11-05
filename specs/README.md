# Specs

Start in [move-permit.md](move-permit.md): it is a fill-in draft, not the answer.
Decide the rules together and replace its bracketed prompts. The agent can
read the whole repository, including your acceptance examples.

## Intent

Who needs the change, and what should become better for them? Keep the
resident's goal separate from an implementation plan.

## Constraints

Decide who may move a permit, what makes a new plate eligible, when each plate
may park, and what happens to price and validity. Do not silently leave these
decisions to the agent. Record an unresolved question explicitly.

## Acceptance criteria

Give each case an ID such as AC1. Use real values from the fictional fixture:

| Resident | Address   | Vehicles registered to them |
| -------- | --------- | --------------------------- |
| R-1001   | Kadeweg 4 | HT-101-A and HT-102-B       |
| R-1002   | Kadeweg 4 | HT-201-C                    |

The API is already present in `permits/src/permits.ts`:

- `book.request({ resident, address, plate }, date)` returns `{ ok: true, permit }`
  or `{ ok: false, reason }`.
- `book.pay(permit.id)` marks an issued permit as paid.
- `book.move(permit.id, newPlate, requestingResident, date)` returns the same
  result shape. It currently returns "not built yet".
- `book.mayPark(plate, date)` returns whether that plate may park on that date.
- Dates are ISO days; amounts in the service are euro cents.

Copy the example below into `test/acceptance/move.test.ts`. First choose the
three expected results from **your AC1**, replacing each `null` with `true` or
`false`. Start with a case your spec says should succeed, so "always refuse"
cannot satisfy the example. The setup creates a paid permit and chooses another vehicle of the
same resident; change the actor, dates or setup if your criterion needs a
different situation. Keep the fixture setup separate from what you expect.

```ts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PermitBook } from '../../permits/src/permits.ts';
import { harbourtown } from '../../permits/src/registers.ts';

test('AC1: moving a permit follows our agreed rule', () => {
  const expected: {
    moveAllowed: boolean | null;
    oldPlateMayPark: boolean | null;
    newPlateMayPark: boolean | null;
  } = {
    moveAllowed: null,
    oldPlateMayPark: null,
    newPlateMayPark: null,
  };
  for (const [decision, value] of Object.entries(expected)) {
    assert.notEqual(value, null, `Choose ${decision} from AC1 before running.`);
  }

  const book = new PermitBook(harbourtown);
  const owner = 'R-1001';
  const oldPlate = 'HT-101-A';
  const newPlate = 'HT-102-B';
  const moveDay = '2026-11-05';
  const issued = book.request(
    { resident: owner, address: 'Kadeweg 4', plate: oldPlate },
    '2026-11-02',
  );
  assert(issued.ok);
  book.pay(issued.permit.id);

  const moved = book.move(issued.permit.id, newPlate, owner, moveDay);

  assert.equal(moved.ok, expected.moveAllowed);
  assert.equal(book.mayPark(oldPlate, moveDay), expected.oldPlateMayPark);
  assert.equal(book.mayPark(newPlate, moveDay), expected.newPlateMayPark);
});
```

Run `npm run check`, or just `node --test test/acceptance/move.test.ts`.
Unfilled decisions produce a clear failure. Once filled, an example that
expects the move to work should fail until the feature exists. That is the
starting evidence for the agent, not a reason to weaken the example.
Add cases for other criteria, such as a different requester or date; do not
derive expected values from the implementation. Save the spec and example in
your team's working branch, commit them there and let the agent work from that branch.

## Out of scope

Name existing behaviour that must stay unchanged, not just features you are
not adding. A move task is not permission to redesign surrounding code.

## Instruction

Tell the agent how to handle gaps, rather than asking it to guess. For example:
list assumptions before coding; stop before building if one concerns money
or personal data. Give the agent the spec path, your acceptance example path
and the branch it should use.
