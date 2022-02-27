const smartweaveContract = require('./pkg/smartweave_contract');

let contractState = {
  counter: 100,
};

main().finally();

async function main() {
  smartweaveContract.initState({...contractState})
  console.log(smartweaveContract.__wasm);

  console.log("Initial contract state:", smartweaveContract.currentState());

  await testInteraction({ Add: { number: 42 } });
  await testInteraction({ Subtract: { number: 43 } });
  await testInteraction({ Subtract: { number: 12 } });
  await testInteraction({ Add: { number: 9 } });
  await testInteraction({ Add: { number: 7 } });
  await testInteraction({ ForeignCall: { contract_tx_id: "bad_contract" } });
  await testInteraction({ ForeignCall: { contract_tx_id: "DAJ" } });
  console.log("\n\nDone!", smartweaveContract.currentState());
}

async function testInteraction(interaction) {
  console.log("\n\nExecuting interaction:", interaction);
  const executionResult = await smartweaveContract.handle(interaction);
  if (executionResult.Err) {
    console.warn("Execution failed: ", executionResult.Err);
  } else {
    console.log("Execution completed successfully :)");
    contractState = executionResult.Ok;
  }
  console.log("State after execution:", executionResult);
}
