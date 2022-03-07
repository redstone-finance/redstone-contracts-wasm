//require('./wasm_exec_tiny.js');
require('./wasm_exec_tiny.js');
const fs = require('fs');

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
                console.log(args[0], args.slice(1));
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

    const wasmBinary = fs.readFileSync('./out/main_demo.wasm');

    const module = await WebAssembly.instantiate(wasmBinary, go.importObject);

    const wasm = module.instance;
    go.run(wasm);

    console.log(wasm.exports);

    console.log('\nhandle():', handle());
}

main().finally();

