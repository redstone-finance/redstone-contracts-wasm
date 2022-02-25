const fs = require("fs");
const loader = require("@assemblyscript/loader");
const Arweave = require("arweave");
const metering = require('wasm-metering')

const wasmBinary = fs.readFileSync(__dirname + "/build/smartweave_contract_bg.wasm");
const meteredWasmBinary = metering.meterWASM(wasmBinary, {
  meterType: "i32",
});

fs.writeFileSync("meteredWasmBinary.wasm", meteredWasmBinary);

const wasm2json = require('wasm-json-toolkit').wasm2json
const json = wasm2json(meteredWasmBinary);
fs.writeFileSync("wasm_module.json", JSON.stringify(json, null, 2))
