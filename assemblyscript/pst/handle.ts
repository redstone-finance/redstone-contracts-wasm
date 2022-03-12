// TODO: add all those imports by default in "transform" - but how?
import {parse, stringify} from "@serial-as/json";
import {console} from "./imports/console";
import {msg} from "./imports/smartweave/msg";
import {Block} from "./imports/smartweave/block";
import {Transaction} from "./imports/smartweave/transaction";
import {Contract} from "./imports/smartweave/contract";
import {ActionSchema, HandlerResultSchema, ResultSchema, SmartweaveSchema, StateSchema} from "./schemas";
import {balance} from "./actions/balance";
import {transfer} from "./actions/transfer";

type ContractFn = (state: StateSchema, action: ActionSchema) => HandlerResultSchema;

const functions: Map<string, ContractFn> = new Map();
// note: inline "array" map initializer does not work in AS.
functions.set("balance", balance);
functions.set("transfer", transfer);

let contractState: StateSchema;

@contract
function handle(state: StateSchema, action: ActionSchema): ResultSchema | null {
  console.log(`Function called: "${action.function}"`);

  const fn = action.function;
  if (functions.has(fn)) {
    const handlerResult = functions.get(fn)(state, action);
    if (handlerResult.state != null) {
      contractState = handlerResult.state;
    }
    return handlerResult.result;
  } else {
    throw new Error(`[CE:WTF] Unknown function ${action.function}`);
  }
}
