# Rust smartweave example contract

## How to use
- [Install wasm-pack](https://rustwasm.github.io/wasm-pack/installer/) (on M1 use `cargo install wasm-pack`)
- Build wasm contract file: `bash build.sh` (it should create `pkg` folder)
- Run wasm contract simulation: `node run.js`

## Code structure
The code structure is very similar to [CosmWasm contracts](https://github.com/CosmWasm/cw-plus/tree/main/contracts/cw20-base/src) code structure. All the code is located in the `src` folder:
- `contract.rs` - contains entrypoint `handle` function. It should not be modified by users
- `lib.rs` - manages submodules. It also should not be modified by users
- `execute.rs` - contains main logic of the contract
- `msg.rs` - describes interaction types
- `state.rs` - describes state type
- `error.rs` - describes error types

## What's next
- JS Exceptions handling: [more info](https://rustwasm.github.io/wasm-bindgen/reference/attributes/on-js-imports/catch.html)
- Inject smartweave methods using `extern` feature: [example code](https://rustwasm.github.io/wasm-bindgen/examples/console-log.html)
- Metering
