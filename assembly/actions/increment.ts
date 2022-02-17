import {ActionSchema, HandlerResultSchema, StateSchema} from "../schemas";

export function increment(state: StateSchema, action: ActionSchema): HandlerResultSchema {
  state.counter += 666;

  return {
    state,
    result: null
  };
}
