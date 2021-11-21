import { ERC20, ContractError } from "./ERC20";
import { console } from "./imports/console";
import { Block } from "./imports/smartweave/block";
import { Transaction } from "./imports/smartweave/transaction";
import { Contract } from "./imports/smartweave/contract";
import { msg } from "./imports/smartweave/msg";
import { setTimeout } from "./imports/api";

export const UINT16ARRAY_ID = idof<Uint16Array>();
export const ProviderData_ID = idof<string[]>();

export class ProviderData {
  name: string;
  description: string;
  manifestTxId: string;

  constructor(name: string, description: string, manifestTxId: string) {
    this.name = name;
    this.description = description;
    this.manifestTxId = manifestTxId;
  }

  toString(): string {
    return `
    ProviderData
      #name: ${this.name}
      #description: ${this.description}
      #manifestTxId: ${this.manifestTxId}
    `;
  }
}

export class RedStoneToken implements ERC20 {
  private _name: string;

  private _symbol: string;

  private _totalSupply: u64 = 0;

  private _balances: Map<string, u64> = new Map<string, u64>();

  private _allowances: Map<string, u64> = new Map<string, u64>();

  private _structField: ProviderData = new ProviderData(
    "RedStone Provider",
    "RedStone Provider desc",
    "RedStone Provider manifest"
  );

  private _arrayField: Uint16Array = new Uint16Array(10);

  constructor(name_: string, symbol_: string) {
    this._name = name_;
    this._symbol = symbol_;

    console.log(`Constructor: ${this._structField.toString()}`);
    console.log(`Block#height: ${Block.height()}`);
    console.log(`Block#indep_hash: ${Block.indep_hash()}`);
    console.log(`Block#timestamp: ${Block.timestamp()}`);

    console.log(`Transaction#id: ${Transaction.id()}`);
    console.log(`Transaction#owner: ${Transaction.owner()}`);
    console.log(`Transaction#target: ${Transaction.target()}`);

    console.log(`Contract#id: ${Contract.id()}`);
    console.log(`Contract#owner: ${Contract.owner()}`);

    console.log(`msg#sender: ${msg.sender()}`);
  }
  
  testTimeout(milliseconds: f32): void {
    setTimeout<ProviderData>((providerData: ProviderData) => {
      console.log("After timeout: " + providerData.name);
    }, milliseconds);
  }

  mint(account: string, amount: u64): void {
    console.log(`mint called ${account}: ${amount}`);

    if (this._balances.has(account)) {
      const currentBalance = this._balances.get(account);
      this._balances.set(account, currentBalance + amount);
    } else {
      this._balances.set(account, amount);
    }
    this._totalSupply += amount;
  }

  burn(account: string, amount: u64): void {
    if (!this._balances.has(account)) {
      throw new ContractError("Account has no balance");
    }

    if (this._balances.get(account) < amount) {
      throw new ContractError("Account has not enough balance");
    }

    const currentBalance = this._balances.get(account);
    this._balances.set(account, currentBalance - amount);
    this._totalSupply -= amount;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get symbol(): string {
    return this._symbol;
  }

  set symbol(value: string) {
    this._symbol = value;
  }

  get totalSupply(): u64 {
    return this._totalSupply;
  }

  get structField(): ProviderData {
    return this._structField;
  }

  get arrayField(): Uint16Array {
    return this._arrayField;
  }

  set arrayField(value: Uint16Array) {
    console.log(`arrayField called ${value}`);
    this._arrayField = value;
  }

  modifyProviderDataArray(data: ProviderData[]): ProviderData[] {
    console.log("modifyProviderDataArray");
    return data.map<ProviderData>((pd) => {
      pd.name += " WASM";
      return pd;
    });
  }
}

export function getToken(): RedStoneToken {
  return new RedStoneToken("RedStone", "RDST");
}
