require('./wasm_exec.js');
const fs = require('fs');


async function main() {
    const go = new Go(); // Defined in wasm_exec.js

    console.log(go.importObject)

    const wasmBinary = fs.readFileSync('./out/main.wasm');

    const module = await WebAssembly.instantiate(wasmBinary, go.importObject);

    const wasm = module.instance;
    go.run(wasm);

    console.log(wasm.exports);

    //wasm.exports.update();

}

main().finally();

