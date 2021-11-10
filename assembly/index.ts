import { console } from "./foo";

// The entry file of your WebAssembly module.



declare const ContractError: any;
declare const SmartWeave: any;

class ContractResult {
  state: ContractsRegistryState

  constructor(state: ContractsRegistryState) {
    this.state = state;
  }
}

interface ContractsRegistryResult {
  [key: string]: string
}

class ContractsRegistryState {
  constructor(public contractAdmins: string[], public counter: number) {
  }
}

interface ContractsRegistryInput {
  function: ContractsRegistryGetFunction;
}


interface ContractsRegistryAction {
  input: ContractsRegistryInput;
  caller: string;
}

type ContractsRegistryGetFunction = "add";
type ContractsRegistrySetFunction = "registerContracts";

export function handle(
  state: ContractsRegistryState,
  action: ContractsRegistryAction
): ContractResult {
  trace("Inside handle function", 2, state.counter, 2);
  console.log("From wasm");
  /*if (action.input.function == "add") {
    //state.counter++;
    return new ContractResult(state); 
  }*/

  return new ContractResult(state);

  //throw new ContractError("Unknown function");
}
