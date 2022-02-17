import {ActionSchema, HandlerResultSchema, StateSchema} from "../schemas";

export function decrement(state: StateSchema, action: ActionSchema): HandlerResultSchema {
  state.counter -= 555;

  return {
    state,
    result: null
  };
}
