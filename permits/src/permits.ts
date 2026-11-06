// Parking permits for Harbourtown residents. Amounts are in euro cents, dates are ISO days.
import type { Registers } from './registers.ts';

export const FIRST_PERMIT = 6000;
export const SECOND_PERMIT = 12000;
export const PER_ADDRESS = 2;
export const MONTHS = 12;

export type Permit = {
  id: number;
  holder: string;
  address: string;
  plate: string;
  start: string;
  end: string;
  price: number;
  paid: boolean;
};

export type Request = { resident: string; address: string; plate: string };

export type Result =
  { ok: true; permit: Permit } | { ok: false; reason: string };

/** A plate a permit was on before a move, from `start` up to but not including `end`. */
type PastPlate = { permit: Permit; plate: string; start: string; end: string };

/** The day `months` months after `day`, as an ISO day. */
export function addMonths(day: string, months: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, 10);
}

/** Whether the permit lets its plate park on `day`. */
export const isValid = (permit: Permit, day: string): boolean =>
  permit.paid && permit.start <= day && day < permit.end;

export class PermitBook {
  readonly permits: Permit[] = [];
  private registers: Registers;
  private pastPlates: PastPlate[] = [];

  constructor(registers: Registers) {
    this.registers = registers;
  }

  /** Requests a permit, or renews the resident's permit for the same plate. Unpaid until paid. */
  request(request: Request, today: string): Result {
    const { resident, address, plate } = request;
    if (!this.registers.livesAt(resident, address))
      return { ok: false, reason: 'You are not registered at this address.' };
    if (!this.registers.keeps(resident, plate))
      return { ok: false, reason: 'This vehicle is not registered to you.' };

    const current = this.permits.find(
      (permit) =>
        permit.holder === resident &&
        permit.plate === plate &&
        isValid(permit, today),
    );
    if (current) {
      // A renewal starts when the current permit ends, so no paid month is lost.
      return this.issue({ ...request, start: current.end }, current.price);
    }

    const atAddress = this.permits.filter(
      (permit) => permit.address === address && isValid(permit, today),
    );
    if (atAddress.length >= PER_ADDRESS)
      return {
        ok: false,
        reason: `An address can have at most ${PER_ADDRESS} permits.`,
      };
    const price = atAddress.length === 0 ? FIRST_PERMIT : SECOND_PERMIT;
    return this.issue({ ...request, start: today }, price);
  }

  /** Marks a permit as paid. Only a paid permit is valid. */
  pay(id: number): void {
    const permit = this.permits.find((candidate) => candidate.id === id);
    if (!permit) throw new Error(`No permit ${id}`);
    permit.paid = true;
  }

  /** Moves a permit and its upcoming renewals to another vehicle, from `today` on. See specs/. */
  move(
    permitId: number,
    plate: string,
    resident: string,
    today: string,
  ): Result {
    const permit = this.permits.find((candidate) => candidate.id === permitId);
    if (!permit || permit.holder !== resident)
      return { ok: false, reason: 'You do not hold this permit.' };
    if (!this.registers.livesAt(resident, permit.address))
      return { ok: false, reason: 'You are not registered at this address.' };
    if (permit.end <= today)
      return { ok: false, reason: 'This permit has expired.' };
    if (today < permit.start) {
      const moved = this.pastPlates.some((past) => past.permit === permit);
      return {
        ok: false,
        reason: moved
          ? 'A permit cannot be moved to an earlier date.'
          : 'This permit has not started yet.',
      };
    }
    if (permit.plate === plate)
      return { ok: false, reason: 'This permit is already on that vehicle.' };
    if (!this.registers.keeps(resident, plate))
      return { ok: false, reason: 'This vehicle is not registered to you.' };

    // A renewal has no stored link to its permit, and has not started, so it has no history to keep.
    for (const renewal of this.permits) {
      if (
        renewal.holder === resident &&
        renewal.plate === permit.plate &&
        renewal.start === permit.end
      )
        renewal.plate = plate;
    }
    this.pastPlates.push({
      permit,
      plate: permit.plate,
      start: permit.start,
      end: today,
    });
    permit.plate = plate;
    permit.start = today;
    return { ok: true, permit };
  }

  /** Whether any permit lets the plate park on `day`, also on a plate it has since moved from. */
  mayPark(plate: string, day: string): boolean {
    return (
      this.permits.some(
        (permit) => permit.plate === plate && isValid(permit, day),
      ) ||
      this.pastPlates.some(
        (past) =>
          past.plate === plate &&
          past.permit.paid &&
          past.start <= day &&
          day < past.end,
      )
    );
  }

  private issue(request: Request & { start: string }, price: number): Result {
    const permit: Permit = {
      id: this.permits.length + 1,
      holder: request.resident,
      address: request.address,
      plate: request.plate,
      start: request.start,
      end: addMonths(request.start, MONTHS),
      price,
      paid: false,
    };
    this.permits.push(permit);
    return { ok: true, permit };
  }
}
