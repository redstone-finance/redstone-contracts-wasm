const fs = require("fs");
const loader = require("@assemblyscript/loader");

// https://github.com/AssemblyScript/assemblyscript/issues/261
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/optimized.wasm"),
  {
    // tricky...
    // https://github.com/AssemblyScript/assemblyscript/issues/384#issuecomment-683940275
    foo: {
      "console.log": (msgPtr) => {
        // at the time of call, wasmExample will be initialized
        console.log("WASM is talking");
      },
    },
  }
);

wasmModule.exports.handle(
  { counter: 0 },
  {
    input: {
      function: "add",
    },
  }
);

//module.exports = wasmModule.exports;
