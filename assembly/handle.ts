import * as console from "bindings/console";
import * as Reflect from "bindings/Reflect";

declare const someKey: externref;

class State {
  constructor(public counter: i32) {}
}

export function handle(state: externref): externref {
  console.log(state);
  // const state = a as State;
  // const state = a as unknown as State;
  console.log(someKey)
  /*Reflect.set(
    state,
    changetype<externref>("counter"),
    changetype<externref>(6)
  );*/
  //console.log(Reflect.get(state, counter));
  // state.counter++;

  // how to set the counter value?
  return state;
}
