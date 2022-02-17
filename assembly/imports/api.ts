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
