// run with --experimental-wasm-reftypes flag, eg: node --experimental-wasm-reftypes index.js
// also - --exportRuntime --enable reference-types has to be set for asc.

const fs = require("fs");
const loader = require("@assemblyscript/loader");

// https://github.com/AssemblyScript/assemblyscript/issues/261
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/optimized.wasm"),
  {
    Reflect: Reflect,
    console: {
      log: function (ref) {
        console.log("WASM:", ref);
      },
    },
    someKey: "counter"
    /*"reference-types": {
      someObject: {
        theKey: "Hello world!"
      },
      external: function(a) {
        return a;
      },
    },*/
    // tricky...
    // https://github.com/AssemblyScript/assemblyscript/issues/384#issuecomment-683940275
    /*foo: {
      "console.log": (msgPtr, arrPtr) => {
        // at the time of call, wasmExample will be initialized
        console.log("[WASM]", wasmModule.exports.__getString(msgPtr), wasmModule.exports.__getArray(arrPtr));
      },
    },*/
  }
);

console.log(wasmModule.exports);
const result = wasmModule.exports.handle({ counter: 5 });
console.log("HOST:", result);

//module.exports = wasmModule.exports;
