//require('./wasm_exec_tiny.js');
require('./wasm_exec.js');
const fs = require('fs');
const metering = require('wasm-metering')

global.redstone = {
    go: {}
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const go = new Go(); // Defined in wasm_exec.js

    let usedGas = 0;

    console.log(go.importObject)
    go.importObject.metering = {
        usegas: function (value) {
            usedGas += value;
        }
    }

    global.redstone.go = {
        console: {
            log: function (...args) {
                console.log(args[0], ...args.slice(1));
            }
        },
        Transaction: {
            id: function () {
                return "transaction.id";
            },
            owner: function () {
                return "33F0QHcb22W7LwWR1iRC8Az1ntZG09XQ03YWuw2ABqA";
            },
            target: function () {
                return "transaction.target";
            }
        },
        Block: {
            indep_hash: function () {
                return "block.indep_hash";
            },
            height: function () {
                return 876345;
            },
            timestamp: function () {
                return 234234234
            }
        },
        Contract: {
            id: function() {
                return "Contract.id";
            },
            owner: function() {
                return "Contract.owner";
            }
        },
        SmartWeave: {
            readContractState: async function (contractTxId) {
                console.log('js: readContractState before timeout');
                await timeout(1000);
                console.log('js: readContractState after timeout');
                return {
                    "ticker": "FOREIGN_PST",
                    "name": "foreign call",
                    "owner": "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M",
                    "balances": {
                        "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M": 100,
                        "33F0QHcb22W7LwWR1iRC8Az1ntZG09XQ03YWuw2ABqA": 500
                    }
                }
            },
        }
    }

    const wasmBinary = fs.readFileSync('./.out/contract.wasm');
    /*const meteredWasmBinary = metering.meterWASM(wasmBinary, {
        meterType: "i32",
    });*/

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

    usedGas = 0;

    const resultTransfer = await handle(JSON.stringify({
        function: 'transfer',
        target: 'uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M',
        qty: 555555
    }));
    // result should be null - state modifying functions do not return value
    console.log('Result from transfer:', resultTransfer);
    console.log('Gas used', usedGas);

    console.log('\ncurrentState()', currentState());

    console.log("\nCalling async handle - balance");
    const resultBalance = await handle(JSON.stringify({
        function: 'balance',
        target: 'uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M',
    }));
    // result should be target balance value - "view" functions return value
    console.log('Result from balance:', resultBalance);

    console.log("\nCalling async handle - foreignCall");
    const resultFc = await handle(JSON.stringify({
        function: 'foreignCall',
        target: 'some-random-contract',
    }));
    // result should be target balance value - "view" functions return value
    console.log('Result from foreignCall:', resultFc);

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

