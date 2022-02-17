import {ActionSchema, HandlerResultSchema, StateSchema} from "../schemas";

export function fullName(state: StateSchema, action: ActionSchema): HandlerResultSchema {
  return {
    state,
    result: {
      fullName: `${state.firstName} ${state.lastName}`
    }
  }
}
