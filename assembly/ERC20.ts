export interface ERC20 {
  mint(account: string, amount: u64): void;

  burn(account: string, amount: u64): void;
}

export class ContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContractError";
  }
}
