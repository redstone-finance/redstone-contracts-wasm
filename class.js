const fs = require("fs");
const loader = require("@assemblyscript/loader");

// https://github.com/AssemblyScript/assemblyscript/issues/261
// 1. creating new module with new memory instance.
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/untouched.wasm"),
  {
    env: {
      memory: new WebAssembly.Memory({
        initial: 1,
      }),
    },
  }
);

const wasmExports = wasmModule.exports;

// 2. using pointer to a class - as in https://www.assemblyscript.org/loader.html#custom-classes
const tokenPtr = wasmExports.getToken();
console.log("tokenPtr: " + tokenPtr);
const token = wasmExports.RedStoneToken.wrap(tokenPtr);
token.name = wasmExports.__newString(
  "[CLASS_FROM_POINTER:name]: RedStone Token 1"
);
token.symbol = wasmExports.__newString(
  "[CLASS_FROM_POINTER:symbol]: RDST_FTW"
);
token.mint(wasmExports.__newString("walletId1"), BigInt(500));
token.mint(wasmExports.__newString("walletId1"), BigInt(1000));
token.mint(wasmExports.__newString("walletId1"), BigInt(666));

try {
  token.burn(wasmExports.__newString("walletId2"), BigInt(666));
} catch (e) {
  // name is 'Error', even though ContractError is being thrown in WASM:
  // https://www.assemblyscript.org/status.html#exceptions
  // - throwing any exception effectively calls "abort"
  console.error(e);
  console.error(e.name);
}
// 3. using class "directly" - as in
// https://github.com/AssemblyScript/assemblyscript/blob/main/lib/loader/tests/index.js#L255
const token2 = new wasmExports.RedStoneToken(
  wasmExports.__newString("RedStone Token 2"),
  wasmExports.__newString("[CLASS_FROM_EXPORT:symbol]: RDST2")
);
token2.name = wasmExports.__newString(
  "[CLASS_FROM_EXPORT:name]: RedStone Token 2"
);
const tokenPtr2 = +token2; // https://github.com/AssemblyScript/assemblyscript/blob/main/lib/loader/tests/index.js#L262
console.log("tokenPtr2: ", tokenPtr2);

const oldMemory = wasmExports.memory;
console.log("saving memory in file");
// 4. dumping WASM module memory into a file (simulates writing to cache)
fs.writeFileSync("contract_mem.dat", Buffer.from(oldMemory.buffer));

// 5. loading memory content from file (simulates reading from cache)
const bufferFromFile = fs.readFileSync("contract_mem.dat"); //that's Uint8Array by default.
console.log("From file@token pointer 1:", bufferFromFile[tokenPtr]);
console.log("From file@token pointer 2:", bufferFromFile[tokenPtr2]);

// 6. creating new WASM memory instance and loading its buffer with data loaded from file
const newMemory = new WebAssembly.Memory({
  initial: 1,
});
const newHeap = new Uint8Array(newMemory.buffer);
// 7. copying memory content - there's probably some better way.
for (let i = 0; i < bufferFromFile.length; i++) {
  newHeap[i] = bufferFromFile[i];
}
console.log("New memory@token pointer 1:", newHeap[tokenPtr]);
console.log("New memory@token pointer 2:", newHeap[tokenPtr2]);

// 8. creating new wasm module with the new memory instance with buffer filled with data from file
const wasmModuleMem = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/untouched.wasm"),
  {
    env: {
      memory: newMemory,
    },
  }
);

const wasmExportsMem = wasmModuleMem.exports;
// note: we will probably also need to write a pointer to the contract object.
const token3 = wasmExportsMem.RedStoneToken.wrap(tokenPtr);
const token4 = wasmExportsMem.RedStoneToken.wrap(tokenPtr2);

console.log("\nloaded token 1 name:", wasmExportsMem.__getString(token3.name));
console.log("loaded token 1 symbol:", wasmExportsMem.__getString(token3.symbol));
console.log("loaded token 1 totalSupply:", BigInt(token3.totalSupply).toString());

console.log("\nloaded token 2 name:", wasmExportsMem.__getString(token4.name));
console.log("loaded token 2 symbol:", wasmExportsMem.__getString(token4.symbol));
console.log("loaded token 2 totalSupply token 2", BigInt(token4.totalSupply).toString());
