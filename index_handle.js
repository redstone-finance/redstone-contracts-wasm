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

const limit = 90000000;
let gasUsed = 0;

const imports = {
  metering: {
    usegas: (gas) => {
      gasUsed += gas;
      if (gasUsed > limit) {
        throw new Error("out of gas!");
      }
    }
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
        fn();
      }, ms);
    },
    clearTimeout,
  },
  env: {
    abort(message, fileName, line, column) {
      console.error("--------- Error message from AssemblyScript ---------");
      console.error("  " + wasmModule.exports.__getString(message));
      console.error(
        '    In file "' + wasmModule.exports.__getString(fileName) + '"'
      );
      console.error(`    on line ${line}, column ${column}.`);
      console.error("-----------------------------------------------------");
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

const {handle} = wasmModule.exports;
const {__newString, __getString, __collect} = wasmModule.exports;

function doHandle(state, action) {
  let statePtr = __newString(JSON.stringify(state));
  let actionPtr = __newString(JSON.stringify(action));
  let resultPtr = handle(statePtr, actionPtr);
  let result = __getString(resultPtr);

  __collect();

  return JSON.parse(result);
}

const state =
  {
    firstName: 'first_ppe',
    lastName: 'last_ppe',
    counter: 0
  }


const action =
  {
    function: 'increment'
  }


const result1 = doHandle(state, action);
console.log(result1);

console.log(`gas used ${gasUsed * 1e-4}`);

const result2 = doHandle(result1, action);
console.log(result2);

console.log(`gas used ${gasUsed * 1e-4}`);




