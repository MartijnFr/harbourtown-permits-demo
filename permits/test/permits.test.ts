import assert from 'node:assert/strict';
import { test } from 'node:test';
import { addMonths, isValid, PermitBook } from '../src/permits.ts';
import { harbourtown } from '../src/registers.ts';

const today = '2026-11-02';

test('addMonths keeps the day of the month', () => {
  assert.equal(addMonths('2026-11-02', 12), '2027-11-02');
  assert.equal(addMonths('2026-03-15', 1), '2026-04-15');
});

test('a permit is valid from its start until the day before its end, once paid', () => {
  const book = new PermitBook(harbourtown);
  const result = book.request(
    { resident: 'R-1001', address: 'Kadeweg 4', plate: 'HT-101-A' },
    today,
  );
  assert(result.ok);
  assert.equal(isValid(result.permit, today), false);
  book.pay(result.permit.id);
  assert.equal(isValid(result.permit, today), true);
  assert.equal(isValid(result.permit, '2027-11-01'), true);
  assert.equal(isValid(result.permit, '2027-11-02'), false);
});

test('paying an unknown permit is an error', () => {
  const book = new PermitBook(harbourtown);
  assert.throws(() => book.pay(99), /No permit 99/);
});
