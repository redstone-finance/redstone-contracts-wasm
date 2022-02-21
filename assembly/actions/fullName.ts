import {ContractResultSchema} from "../handle";
import {ActionSchema, StateSchema} from "../schemas";

export function fullName(state: StateSchema, action: ActionSchema): ContractResultSchema {
  return {
    state,
    result: {
      fullName: `${state.firstName} ${state.lastName}`
    }
  }
}