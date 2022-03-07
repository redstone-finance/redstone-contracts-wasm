//require('./wasm_exec_tiny.js');
require('./wasm_exec.js');
const fs = require('fs');


async function main() {
    const go = new Go(); // Defined in wasm_exec.js

    console.log(go.importObject)

    const wasmBinary = fs.readFileSync('./out/contract.wasm');

    const module = await WebAssembly.instantiate(wasmBinary, go.importObject);

    const wasm = module.instance;
    go.run(wasm);

    console.log(wasm.exports);

    console.log('lang():', lang());
    console.log('contractType():', contractType());
    console.log('initState():', initState(JSON.stringify(
        {
            "ticker": "EXAMPLE_PST_TOKEN",
            "owner": "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M",
            "canEvolve": true,
            "balances": {
                "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M": 10000000,
                "33F0QHcb22W7LwWR1iRC8Az1ntZG09XQ03YWuw2ABqA": 23111222
            }
        }
    )));
    console.log("Calling async handle");
    const result = await handle(JSON.stringify({
        function: 'transfer',
        target: 'ppe',
        qty: 345345
    }));
    console.log('Result from async handle:', result);
    console.log('currentState()', currentState());

    console.log("Checking exception handling");
    try {
        await handle(JSON.stringify({
            function: 'someRandomFunction',
        }));
    } catch (e) {
        console.error(e);
    }

}

main().finally();

