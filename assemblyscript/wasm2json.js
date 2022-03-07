const fs = require("fs");
const metering = require('wasm-metering')

const wasmBinary = fs.readFileSync(__dirname + "/go.wasm");
const meteredWasmBinary = metering.meterWASM(wasmBinary, {
  meterType: "i32",
});

fs.writeFileSync("go-metered.wasm", meteredWasmBinary);
