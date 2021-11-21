const fs = require("fs");
const loader = require("@assemblyscript/loader");
const Sw = require("redstone-smartweave/lib/cjs/legacy/smartweave-global");
const Arweave = require("arweave");

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

const SwGlobal = new Sw.SmartWeaveGlobal(arweave, {
  id: "contractDefinition.txId",
  owner: "contractDefinition.owner",
});

const imports = {
  block: {
    "Block.height": function () {
      return 878333;
    },
    "Block.indep_hash": function () {
      return wasmExports.__newString("Block.indep_hash");
    },
    "Block.timestamp": function () {
      return 123123123;
    },
  },
  transaction: {
    "Transaction.id": function () {
      return wasmExports.__newString("Transaction.id");
    },
    "Transaction.owner": function () {
      return wasmExports.__newString("Transaction.owner");
    },
    "Transaction.target": function () {
      return wasmExports.__newString("Transaction.target");
    },
  },
  contract: {
    "Contract.id": function () {
      return wasmExports.__newString("Contract.id");
    },
    "Contract.owner": function () {
      return wasmExports.__newString("Contract.owner");
    },
  },
  msg: {
    "msg.sender": function () {
      return wasmExports.__newString("msg.sender");
    },
  },
  console: {
    "console.log": function (msg) {
      console.log(`WASM: ${wasmExports.__getString(msg)}`);
    },
  },
  api: {
    _setTimeout: (fnIndex, ms) => {
      return setTimeout(() => {
        const fn = getFn(fnIndex);
        const pd = new wasmExports.ProviderData();
        pd.name = wasmExports.__newString("Timeout provider");
        fn(pd);
      }, ms);
    },
    clearTimeout,
  },
  env: {
    // note: --importMemory flag must be switched on for ASC
    memory: new WebAssembly.Memory({
      initial: 1,
    }),
    memoryBase: 0,
    abort(message, fileName, line, column) {
      console.error("--------- Error message from AssemblyScript ---------");
      console.error("  " + wasmModule.exports.__getString(message));
      console.error(
        '    In file "' + wasmModule.exports.__getString(fileName) + '"'
      );
      console.error(`    on line ${line}, column ${column}.`);
      console.error("-----------------------------------------------------");
    },
    /* table: new WebAssembly.Table({
       element: "anyfunc",
       initial: 256,
     }),
     tableBase: 0,*/
  },
};

// https://github.com/AssemblyScript/assemblyscript/issues/261
// 1. creating new module with new memory instance.
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/untouched.wasm"),
  imports
);

const wasmExports = wasmModule.exports;

function getFn(idx) {
  return wasmExports.table.get(idx);
}

// 2. using pointer to a class - as in https://www.assemblyscript.org/loader.html#custom-classes
const tokenPtr = wasmExports.getToken();
console.log("tokenPtr: " + tokenPtr);
const token = wasmExports.RedStoneToken.wrap(tokenPtr);
token.name = wasmExports.__newString(
  "[CLASS_FROM_POINTER:name]: RedStone Token 1"
);
token.symbol = wasmExports.__newString("[CLASS_FROM_POINTER:symbol]: RDST_FTW");
token.mint(wasmExports.__newString("walletId1"), BigInt(500));
token.mint(wasmExports.__newString("walletId1"), BigInt(1000));
token.mint(wasmExports.__newString("walletId1"), BigInt(666));

token.testTimeout(4000);

const arrPtr = token.arrayField;
const array = wasmExports.__getArray(arrPtr);
console.log("Array", array);
array[0] = 20;
token.arrayField = wasmExports.__newArray(wasmExports.UINT16ARRAY_ID, array);

// based on https://github.com/AssemblyScript/examples/blob/main/loader/tests/index.js#L84
const elemPtrs = ["provider_1", "provider_2", "provider_3"].map((v) => {
  // note: using __pin here throws
  // "Error: abort: Object already pinned at ~lib/rt/itcms.ts:337:7"
  const sf = new wasmExports.ProviderData();
  sf.name = wasmExports.__newString(v);

  return sf;
});

const inPtr = wasmExports.__pin(
  wasmExports.__newArray(wasmExports.ProviderData_ID, elemPtrs)
);

const outPtr = wasmExports.__pin(token.modifyProviderDataArray(inPtr));

console.log(
  "PD Array",
  wasmExports.__getArray(outPtr).map((p) => {
    const pd = wasmExports.ProviderData.wrap(p);

    return wasmExports.__getString(pd.name);
  })
);

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
const structField1 = wasmExports.ProviderData.wrap(token2.structField);
structField1.name = wasmExports.__newString("Provider From Host");

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
    ...imports,
    ...{
      ...imports.env,
      env: {
        memory: newMemory,
      },
    },
  }
);

const wasmExportsMem = wasmModuleMem.exports;
// note: we will probably also need to write a pointer to the contract object.
const token3 = wasmExportsMem.RedStoneToken.wrap(tokenPtr);
const token4 = wasmExportsMem.RedStoneToken.wrap(tokenPtr2);

console.log("\nloaded token 1 name:", wasmExportsMem.__getString(token3.name));
console.log(
  "loaded token 1 symbol:",
  wasmExportsMem.__getString(token3.symbol)
);
console.log(
  "loaded token 1 totalSupply:",
  BigInt(token3.totalSupply).toString()
);

console.log("\nloaded token 2 name:", wasmExportsMem.__getString(token4.name));
console.log(
  "loaded token 2 symbol:",
  wasmExportsMem.__getString(token4.symbol)
);
console.log(
  "loaded token 2 totalSupply",
  BigInt(token4.totalSupply).toString()
);

// accessing internal struct in contract
const structField = wasmExportsMem.ProviderData.wrap(token4.structField);
console.log(
  "\nloaded token 2 structField",
  wasmExportsMem.__getString(structField.name)
);
console.log(
  "loaded token 2 structField",
  wasmExportsMem.__getString(structField.description)
);
console.log(
  "loaded token 2 structField",
  wasmExportsMem.__getString(structField.manifestTxId)
);

// accessing internal array in contract
const arrPtr2 = token3.arrayField;
const array2 = wasmExportsMem.__getArray(arrPtr2);
console.log("\n token 1 array", array2);
