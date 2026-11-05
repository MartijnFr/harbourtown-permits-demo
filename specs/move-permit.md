# Move a permit to another vehicle

This is your team's draft, not an agreed policy. Replace every bracketed prompt
with a decision or an explicit question before asking the agent to build it.
See [the spec guide](README.md) for the API, fictional test data and a copyable test.

## Intent

As a resident, I want to move my parking permit to my new car, so that
[the benefit for the resident].

## Constraints

- Who may request the move? [Decide.]
- Which new vehicles are allowed, and how is that checked? [Decide.]
- When does the new plate become valid, and when does the old one stop? [Decide.]
- What happens to the permit's end date and price? [Decide.]
- Which permit states allow a move, such as paid, unpaid or expired? [Decide.]

## Acceptance criteria

Write concrete cases. Start with one, give it an ID and use that same ID in
your test name. Add more rows for other decisions your team makes.

| ID  | Given                                                       | When                                        | Then                                                       |
| --- | ----------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------- |
| AC1 | [Resident, paid or unpaid permit, old plate and new plate.] | [Who requests the move, and on which date?] | [Allowed or refused? Which plate may park, and from when?] |

## Out of scope

[Name what this change must not alter. Consider existing requests, payments
and renewals; do not ask the agent to tidy up unrelated behaviour.]

## Instruction

[Write how the agent handles gaps. For example: list assumptions before coding;
stop and ask when a decision concerns money or personal data.]
