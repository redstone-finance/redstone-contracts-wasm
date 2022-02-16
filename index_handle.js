const fs = require("fs");
const loader = require("@assemblyscript/loader");

const wasmBinary = fs.readFileSync(__dirname + "/build/optimized.wasm");
// https://github.com/AssemblyScript/assemblyscript/issues/261
// 1. creating new module with new memory instance.
const wasmModule = loader.instantiateSync(
  wasmBinary,
);

const {handle} = wasmModule.exports;
const {__newString, __getString} = wasmModule.exports;

function doHandle(state, action) {
  let statePtr = __newString(JSON.stringify(state));
  let actionPtr = __newString(JSON.stringify(action));
  let resultPtr = handle(statePtr, actionPtr);
  let result = __getString(resultPtr);

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
    functionName: 'increment'
  }


const result1 = doHandle(state, action);
console.log(result1);

const result2 = doHandle(result1, action);
console.log(result2);



