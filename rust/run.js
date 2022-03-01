const smartweaveContract = require("./pkg/smartweave_contract");

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

  smartweaveContract.initState(contractState);
  console.log("Initial contract state:", smartweaveContract.currentState());

  await testInteraction({
    function: "transfer",
    amount: 42,
    target: "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M"
  });

  await testInteraction({
    function: "balance",
    target: "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M"
  });

  await testInteraction({
    function: "transfer",
    amount: 133,
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
  });

  /* await testInteraction({ Subtract: { number: 43 } });
   await testInteraction({ Subtract: { number: 12 } });
   await testInteraction({ Add: { number: 9 } });
   await testInteraction({ Add: { number: 7 } });
   await testInteraction({ ForeignCall: { contract_tx_id: "bad_contract" } });
   await testInteraction({ ForeignCall: { contract_tx_id: "DAJ" } });*/
  console.log("\n\nDone!", smartweaveContract.currentState());
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
