const smartweaveContract = require("./pkg/rust-pst");

let contractState = {
  "ticker": "EXAMPLE_PST_TOKEN",
  "name": "token name",
  "owner": "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M",
  "balances": {
    "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M": 10000000,
    "33F0QHcb22W7LwWR1iRC8Az1ntZG09XQ03YWuw2ABqA": 23111222
  }
};

main().finally();

async function main() {

  const path = require('path').join(__dirname, 'pkg', 'rust-pst_bg.wasm');
  const bytes = require('fs').readFileSync(path);

  const module = new WebAssembly.Module(bytes);
  const imports = WebAssembly.Module.imports(module);
  const exports = WebAssembly.Module.exports(module);
  console.log(imports);
  console.log(exports);
  const wbindgenImports = imports.filter(imp => {
    return imp.module === '__wbindgen_placeholder__';
  }).map(imp => imp.name);

  const baseFnNames = [
    '__wbg_log_',
    '__wbindgen_json_parse',
    '__wbindgen_json_serialize',
    '__wbindgen_object_drop_ref',
    '__wbindgen_cb_drop',
    '__wbg_readContractState',
    '__wbg_viewContractState',
    '__wbg_indephash',
    '__wbg_height',
    '__wbg_timestamp',
    '__wbg_id',
    '__wbg_owner',
    '__wbg_target',
    '__wbg_contractId',
    '__wbg_contractOwner',
    '__wbg_call',
    '__wbg_new',
    '__wbg_resolve',
    '__wbg_then',
    '__wbindgen_debug_string',
    '__wbindgen_throw',
    '__wbindgen_closure_wrapper'
  ];

  console.log({
    baseLength: baseFnNames.length,
    importsLength: wbindgenImports.length
  });

  if (baseFnNames.length != wbindgenImports.length) {
    throw new Error("module not compatible with current sdk version");
  }

  const nameMapping = baseFnNames.reduce((acc, baseName) => {
    acc[baseName] = wbindgenImports.find(wbImp => wbImp.startsWith(baseName));
    return acc;
  }, {});

  console.log(nameMapping);

  /*console.log("BEGIN", smartweaveContract.currentState());

  smartweaveContract.initState(contractState);
  console.log("Initial contract state:", smartweaveContract.currentState());

  await testInteraction({
    function: "transfer",
    qty: 42,
    target: "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M"
  });

  await testInteraction({
    function: "balance",
    target: "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M"
  });

  await testInteraction({
    function: "transfer",
    qty: 133,
    target: "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M"
  });

  await testInteraction({
    function: "balance",
    target: "33F0QHcb22W7LwWR1iRC8Az1ntZG09XQ03YWuw2ABqA"
  });

  await testInteraction({
    function: "foreignCall",
    contract_tx_id: "bad_contract"
  });

  await testInteraction({
    function: "foreignCall",
    contract_tx_id: "-Daj"
  });*/

  /* await testInteraction({ Subtract: { number: 43 } });
   await testInteraction({ Subtract: { number: 12 } });
   await testInteraction({ Add: { number: 9 } });
   await testInteraction({ Add: { number: 7 } });
   await testInteraction({ ForeignCall: { contract_tx_id: "bad_contract" } });
   await testInteraction({ ForeignCall: { contract_tx_id: "DAJ" } });*/
  console.log("\n\nEND", smartweaveContract.currentState());
}

async function testInteraction(interaction) {
  console.log("\n\nExecuting interaction:", interaction);
  const executionResult = await smartweaveContract.handle(interaction);

  console.log("Execution result", executionResult);


  if (executionResult) {
    if (executionResult.Err) {
      console.warn("Execution failed: ", executionResult.Err);
    } else {
      console.log("Execution completed successfully :)");
      let result = executionResult.Ok;
      console.log("Result from view function", result);
    }

  }

}
