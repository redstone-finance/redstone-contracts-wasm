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

    console.log('\nlang():', lang());
    console.log('\ncontractType():', contractType());
    console.log('\ninitState():', initState(JSON.stringify(
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
    console.log('\ncurrentState()', currentState());

    console.log("\nCalling async handle - transfer");
    const resultTransfer = await handle(JSON.stringify({
        function: 'transfer',
        target: 'uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M',
        qty: 555555
    }));
    // result should be null - state modifying functions do not return value
    console.log('Result from transfer:', resultTransfer);
    console.log('\ncurrentState()', currentState());

    console.log("\nCalling async handle - balance");
    const resultBalance = await handle(JSON.stringify({
        function: 'balance',
        target: 'uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M',
    }));
    // result should be target balance value - "view" functions return value
    console.log('Result from balance:', resultBalance);

    console.log("\n\nChecking exception handling (should throw here)");
    try {
        await handle(JSON.stringify({
            function: 'someRandomFunction',
        }));
    } catch (e) {
        console.error(e);
    }
}

main().finally();

