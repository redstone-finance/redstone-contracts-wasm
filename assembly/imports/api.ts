export declare function _setTimeout(fn: usize, milliseconds: f32): i32

export function setTimeout<T = unknown>(fn: (t: T) => void, milliseconds: f32 = 0.0): i32 {
  return _setTimeout(fn.index, milliseconds)
}

export declare function clearTimeout(id: i32): void


export declare function _readContractState(fn: usize, contractTxId: string): i32;

// note: this requires adding --exportTable to asc
export function readContractState(fn: (t: string) => void, contractTxId: string): i32 {
  return _readContractState(fn.index, contractTxId);
}

export type ContractFn<S, A, R> = (state: S, action: A) => HandlerResultSchema<S, R>;


@serializable
export class HandlerResultSchema<S, R> {
  state: S
  result: R | null
}

@serializable
export class SmartweaveSchema {
  contract: ContractSchema
  block: BlockSchema
  transaction: TransactionSchema
}


@serializable
export class BlockSchema {
  height: i32
  indep_hash: string
  timestamp: i32
}

@serializable
export class TransactionSchema {
  id: string
  owner: string
  target: string
}

@serializable
export class ContractSchema {
  id: string
  owner: string
}
