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

@contract
function handle(state: StateSchema, action: ActionSchema): StateSchema {
  if (action.function == "increment") {
    state.counter += 666;
  }

  return state;
}
