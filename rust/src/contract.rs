use lazy_static::lazy_static;
use std::sync::{Mutex, MutexGuard};
use wasm_bindgen::prelude::*;

use crate::action::Action;
use crate::actions::transfer::transfer;
use crate::js_imports::{Block, Transaction, log};
use crate::state::{HandlerResult, State};

lazy_static! {
    static ref STATE: Mutex<State> = Mutex::new(State::default());
}

#[wasm_bindgen]
pub struct ContractHandle {
    state: State,
}

#[wasm_bindgen]
impl ContractHandle {
    #[wasm_bindgen(constructor)]
    pub fn new() -> ContractHandle {
        ContractHandle {
            state: State::default()
        }
    }

    // TODO: perf: https://github.com/cloudflare/serde-wasm-bindgen
    pub fn handle(&mut self, interaction: &JsValue) -> JsValue {
        log(&format!("Block indep_hash {}", Block::indep_hash()));
        log(&format!("Block height {}", Block::height()));
        log(&format!("Block timestamp {}", Block::timestamp()));
        log(&format!("Transaction owner {}", Transaction::owner()));

        let action = interaction.into_serde();
        if action.is_err() {
            log(&format!("Error {}", action.as_ref().err().unwrap()));
        }

        let static_state: &Mutex<State> = &*STATE;
        let mut mut_static_state: MutexGuard<State> = static_state.lock().unwrap();
        let new_state = State::default();

        mut_static_state.owner = "blabla".to_string();

        // but how to assing the whole state? sth like:
        // mut_static_state = new_state;

        log("Action parsed");

        // not sure about clone here
        let current_state = self.state.clone();

        let result = match action.unwrap() {
            Action::Transfer { amount, target } => transfer(current_state, amount, target),
            /* Action::Balance { target } => balance(current_state, target),
             Action::Evolve { value } => balance(current_state, value),*/
        };

        if result.is_ok() {
            log("Result ok");
            let handler_result = result.as_ref().ok().unwrap();

            return if let HandlerResult::NewState(state) = handler_result {
                log("Setting new state");
                self.state = state.clone();
                JsValue::from_serde(&result).unwrap()
            } else {
                JsValue::from_serde(&result).unwrap()
            }
        } else {
            JsValue::from_serde(&result).unwrap()
        }


    }

    #[wasm_bindgen(js_name = initState)]
    pub fn init_state(&mut self, state: &JsValue) {
        log(&format!("Calling init state"));
        self.state = state.into_serde().unwrap();
    }

    #[wasm_bindgen(js_name = currentState)]
    pub fn current_state(&self) -> JsValue {
        log(&format!("Calling current state"));

        // not sure if that's deterministic - which is very important for the execution network.
        // TODO: perf - according to docs:
        // "This is unlikely to be super speedy so it's not recommended for large payload"
        // - we should minimize calls to from_serde
        JsValue::from_serde(&self.state).unwrap()
    }
}


#[wasm_bindgen()]
pub fn lang() -> String {
    return "rust/1.0".to_string();
}

// workaround for now to simplify type reading without as/loader
// 1 = assemblyscript
// 2 = rust
// 3 = go
// 4 = swift
// 5 = c
#[wasm_bindgen(js_name = type)]
pub fn contract_type() -> i32 {
    return 2;
}

