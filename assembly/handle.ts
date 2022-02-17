// TODO: add all those imports by default in "transform" - but how?
import {parse, stringify} from "@serial-as/json";
import {console} from "./imports/console";
import {msg} from "./imports/smartweave/msg";
import {Block} from "./imports/smartweave/block";
import {Transaction} from "./imports/smartweave/transaction";
import {Contract} from "./imports/smartweave/contract";


@serializable
class StateSchema {
  firstName: string
  lastName: string
  counter: i32
}


@serializable
class ActionSchema {
  function: string
}


@serializable
class ResultSchema {
  fullName: string
}


@serializable
class SmartweaveSchema {
  contract: ContractSchema
  sender: string
  block: BlockSchema
  transaction: TransactionSchema
}


@serializable
class BlockSchema {
  height: i32
  indep_hash: string
  timestamp: i32
}

@serializable
class TransactionSchema {
  id: string
  owner: string
  target: string
}

@serializable
class ContractSchema {
  id: string
  owner: string
}


@serializable
class HandlerResultSchema {
  state: StateSchema
  result: ResultSchema | null
}

@contract
function handle(state: StateSchema, action: ActionSchema): HandlerResultSchema {
  console.log(`Function called: "${action.function}"`);
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


  if (action.function == "increment") {
    state.counter += 666;

    return {
      state,
      result: null
    };
  }

  if (action.function == "increment") {
    state.counter -= 555;

    return {
      state,
      result: null
    };
  }

  if (action.function == "fullName") {
    return {
      state,
      result: {
        fullName: `${state.firstName} ${state.lastName}`
      }
    }
  }

  // TODO: add to commons library
  throw new Error(`[CE:WTF] Unknown function ${action.function}`);
}
