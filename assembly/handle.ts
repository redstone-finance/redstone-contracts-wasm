// TODO: add in transform - but how?
import {parse, stringify} from "@serial-as/json";
import { console } from "./imports/console";

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
class HandlerResultSchema {
  state: StateSchema
  result: ResultSchema | null
}

@contract
function handle(state: StateSchema, action: ActionSchema): HandlerResultSchema {

  if (action.function == "increment") {
    state.counter += 666;

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

  throw new Error(`Unknown function ${action.function}`);
}
