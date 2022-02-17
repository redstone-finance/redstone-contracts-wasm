const fs = require("fs");
const loader = require("@assemblyscript/loader");
const metering = require('wasm-metering');

const wasmBinary = fs.readFileSync(__dirname + "/build/optimized.wasm");
const meteredWasmBinary = metering.meterWASM(wasmBinary, {
  meterType: "i32",
});
const wasm2json = require('wasm-json-toolkit').wasm2json
const json = wasm2json(meteredWasmBinary);
fs.writeFileSync("wasm_module.json", JSON.stringify(json, null, 2))

const limit = 55000000;
let gasUsed = 0;

const imports = {
  metering: {
    usegas: (gas) => {
      gasUsed += gas;
      if (gasUsed > limit) {
        throw new Error(`[RE:OOG] Out of gas! Limit: ${formatGas(limit)}, used: ${formatGas(gasUsed)}`);
      }
    }
  },
  console: {
    "console.log": function (msg) {
      console.log(`Contract: ${wasmExports.__getString(msg)}`);
    },
    "console.logO": function (msg, obj) {
      console.log(`Contract: ${wasmExports.__getString(msg)}`, JSON.parse(wasmExports.__getString(obj)));
    },
  },
  block: {
    "Block.height": function () {
      return 875290;
    },
    "Block.indep_hash": function () {
      return wasmExports.__newString("iIMsQJ1819NtkEUEMBRl6-7I6xkeDipn1tK4w_cDFczRuD91oAZx5qlgSDcqq1J1");
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
  env: {
    abort(message, fileName, line, column) {
      console.error("--------------------- Error message from AssemblyScript ----------------------");
      console.error("  " + wasmModule.exports.__getString(message));
      console.error(
        '    In file "' + wasmModule.exports.__getString(fileName) + '"'
      );
      console.error(`    on line ${line}, column ${column}.`);
      console.error("------------------------------------------------------------------------------\n");
    },
  }
}

function getFn(idx) {
  return wasmExports.table.get(idx);
}

const wasmModule = loader.instantiateSync(
  meteredWasmBinary,
  imports
);

const wasmExports = wasmModule.exports;

const {handle, lang} = wasmModule.exports;
const {__newString, __getString, __collect} = wasmModule.exports;

function doHandle(state, action) {
  // TODO: consider NOT using @assemblyscript/loader and handle conversions manually
  // - as @assemblyscript/loader adds loads of crap to the output binary.

  let statePtr = __newString(JSON.stringify(state));
  let actionPtr = __newString(JSON.stringify(action));
  let resultPtr = handle(statePtr, actionPtr);
  let result = __getString(resultPtr);

  __collect();

  return JSON.parse(result);
}

const initialState =
  {
    firstName: 'first_ppe',
    lastName: 'last_ppe',
    counter: 0
  };


const actions = [
  {function: 'increment'},
  {function: 'increment'},
  {function: 'increment'},
  {function: 'fullName'},
  {function: 'unknownFn'}, /* this one should throw unknown function */
  {function: 'increment'}, /* this one should throw out of gas */
  {function: 'decrement'}  /* this one should not be called */
]

let state = initialState;

// note: this will be useful in SDK to prepare the wasm execution env. properly
// for contracts written in different langs (eg. in assemblyscript we can use the
// built-in @assemblyscript/loader to simplify the communication - but obv. it wont' be available
// in Rust or Go)
console.log("Contract language:", __getString(lang));

for (const action of actions) {
  try {
    console.log("==============================================================================")
    const handlerResult = doHandle(state, action);
    state = handlerResult.state;
    console.log({
      handlerResult,
      gas: `${formatGas(gasUsed)}`,
      gasLimit: `${formatGas(limit)}`
    });
  } catch (e) {
    // note: as exceptions handling in WASM is currently somewhat non-existent
    // https://www.assemblyscript.org/status.html#exceptions
    // and since we have to somehow differentiate different types of exceptions
    // - each exception message has to have a proper prefix added.

    // exceptions with prefix [RE:] ("Runtime Exceptions") should break the execution immediately
    // - eg: [RE:OOG] - [RuntimeException: OutOfGas]

    // exception with prefix [CE:] ("Contract Exceptions") should be logged, but should not break
    // the state evaluation - as they are considered as contracts' business exception (eg. validation errors)
    // - eg: [CE:WTF] - [ContractException: WhatTheFunction] ;-)
    if (e.message.startsWith('[RE:')) {
      throw e;
    } else {
      console.error(e.message);
    }
  }
}


function formatGas(gas) {
  return `${gas * 1e-4}`;
}
