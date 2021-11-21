export declare function _setTimeout(fn: usize, milliseconds: f32): i32

export function setTimeout<T = unknown>(fn: (t: T) => void, milliseconds: f32 = 0.0): i32 {
  return _setTimeout(fn.index, milliseconds)
}

export declare function clearTimeout(id: i32): void
