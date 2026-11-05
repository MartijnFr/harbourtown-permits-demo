// Harbourtown's municipal register and vehicle register. Fictional people, addresses and plates.

export interface Registers {
  /** Whether the resident lives at the address, according to the municipal register. */
  livesAt(resident: string, address: string): boolean;
  /** Whether the vehicle register lists the resident as the keeper of the plate. */
  keeps(resident: string, plate: string): boolean;
}

const residents: Record<string, string> = {
  'R-1001': 'Kadeweg 4',
  'R-1002': 'Kadeweg 4',
  'R-1003': 'Kadeweg 4',
  'R-2001': 'Havenstraat 17',
};

const keepers: Record<string, string> = {
  'HT-101-A': 'R-1001',
  'HT-102-B': 'R-1001',
  'HT-201-C': 'R-1002',
  'HT-301-D': 'R-1003',
  'HT-401-E': 'R-2001',
  'HT-402-F': 'R-2001',
};

/** The registers with Harbourtown's test data. */
export const harbourtown: Registers = {
  livesAt: (resident, address) => residents[resident] === address,
  keeps: (resident, plate) => keepers[plate] === resident,
};
