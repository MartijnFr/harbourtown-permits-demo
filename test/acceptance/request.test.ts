// Acceptance examples for requesting a permit, written by the product owner.
// They define "correct": change them only with the product owner's yes.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  FIRST_PERMIT,
  PermitBook,
  SECOND_PERMIT,
} from '../../permits/src/permits.ts';
import { harbourtown } from '../../permits/src/registers.ts';

const today = '2026-11-02';

test('a resident gets a 12-month permit for their own vehicle, valid once paid', () => {
  const book = new PermitBook(harbourtown);
  const result = book.request(
    { resident: 'R-2001', address: 'Havenstraat 17', plate: 'HT-401-E' },
    today,
  );
  assert(result.ok);
  assert.equal(result.permit.end, '2027-11-02');
  assert.equal(result.permit.price, FIRST_PERMIT);
  assert.equal(book.mayPark('HT-401-E', today), false);
  book.pay(result.permit.id);
  assert.equal(book.mayPark('HT-401-E', today), true);
});

test('someone who does not live at the address is refused', () => {
  const book = new PermitBook(harbourtown);
  const result = book.request(
    { resident: 'R-2001', address: 'Kadeweg 4', plate: 'HT-401-E' },
    today,
  );
  assert.deepEqual(result, {
    ok: false,
    reason: 'You are not registered at this address.',
  });
});

test('a vehicle the resident does not keep is refused', () => {
  const book = new PermitBook(harbourtown);
  const result = book.request(
    { resident: 'R-1002', address: 'Kadeweg 4', plate: 'HT-101-A' },
    today,
  );
  assert.equal(result.ok, false);
});

test('the second permit at an address costs more, and a third is refused', () => {
  const book = new PermitBook(harbourtown);
  for (const [resident, plate, price] of [
    ['R-1001', 'HT-101-A', FIRST_PERMIT],
    ['R-1002', 'HT-201-C', SECOND_PERMIT],
  ] as const) {
    const result = book.request(
      { resident, address: 'Kadeweg 4', plate },
      today,
    );
    assert(result.ok);
    assert.equal(result.permit.price, price);
    book.pay(result.permit.id);
  }
  const third = book.request(
    { resident: 'R-1003', address: 'Kadeweg 4', plate: 'HT-301-D' },
    today,
  );
  assert.equal(third.ok, false);
});

test('a renewal starts when the current permit ends', () => {
  const book = new PermitBook(harbourtown);
  const first = book.request(
    { resident: 'R-2001', address: 'Havenstraat 17', plate: 'HT-401-E' },
    today,
  );
  assert(first.ok);
  book.pay(first.permit.id);
  const renewal = book.request(
    { resident: 'R-2001', address: 'Havenstraat 17', plate: 'HT-401-E' },
    '2027-10-01',
  );
  assert(renewal.ok);
  assert.equal(renewal.permit.start, '2027-11-02');
  assert.equal(renewal.permit.end, '2028-11-02');
});
