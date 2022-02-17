// TODO: add all those imports by default in "transform" - but how?
import {parse, stringify} from "@serial-as/json";
import {console} from "./imports/console";
import {msg} from "./imports/smartweave/msg";
import {Block} from "./imports/smartweave/block";
import {Transaction} from "./imports/smartweave/transaction";
import {Contract} from "./imports/smartweave/contract";
import {ActionSchema, HandlerResultSchema, ResultSchema, SmartweaveSchema, StateSchema} from "./schemas";
import {increment} from "./actions/increment";
import {decrement} from "./actions/decrement";
import {fullName} from "./actions/fullName";
import {foreignRead} from "./actions/foreignRead";

type ContractFn = (state: StateSchema, action: ActionSchema) => HandlerResultSchema;

const functions: Map<string, ContractFn> = new Map();
// note: inline "array" map initializer does not work in AS.
functions.set("increment", increment);
functions.set("decrement", decrement);
functions.set("fullName", fullName);
functions.set("foreignRead", foreignRead);

let contractState: StateSchema = {
  firstName: '',
  lastName: '',
  counter: 0
};

@contract
function handle(action: ActionSchema): ResultSchema | null {
  console.log(`Function called: "${action.function}"`);
  /*
  console.logO(`Smartweave:`, stringify<SmartweaveSchema>({
    contract: {
      id: Contract.id(),
      owner: Contract.owner()
    },
    sender: msg.sender(),
    block: {
      height: Block.height(),
      indep_hash: Block.indep_hash(),
      timestamp: Block.timestamp()
    },
    transaction: {
      id: Transaction.id(),
      owner: Transaction.owner(),
      target: Transaction.target()
    }
  }));
*/
  const fn = action.function;
  if (functions.has(fn)) {
    const handlerResult = functions.get(fn)(contractState, action);
    if (handlerResult.state != null) {
      contractState = handlerResult.state;
    }
    return handlerResult.result;
  } else {
    throw new Error(`[CE:WTF] Unknown function ${action.function}`);
  }

  // no switch on strings in AS https://github.com/AssemblyScript/assemblyscript/issues/1518
  /*if (fn == "increment") {
    return increment(state, action);
  } else if (fn == "decrement") {
    return decrement(state, action);
  } else if (fn == "fullName") {
    return fullName(state, action)
  } else {
    throw new Error(`[CE:WTF] Unknown function ${action.function}`);
  }*/
}
