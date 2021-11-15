export class Token {
  private _name: string;

  _symbol: string;

  _totalSupply: u64;

  _balances: Map<string, u64> = new Map<string, u64>();

  _allowances: Map<string, u64> = new Map<string, u64>();

  constructor(name_: string, symbol_: string, totalSupply_: u64) {
    this._name = name_;
    this._symbol = symbol_;
    this._totalSupply = totalSupply_;
  }


  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get totalSupply(): u64 {
    return this._totalSupply;
  }

}

export function getToken(): Token {
  return new Token("RedStone", "RDST", 30000);
}
