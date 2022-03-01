use lazy_static::lazy_static;
use std::sync::{Mutex};
use wasm_bindgen::prelude::*;

use crate::action::Action;
use crate::actions::balance::balance;
use crate::actions::evolve::evolve;
use crate::actions::foreign_call::foreign_call;
use crate::actions::transfer::transfer;
use crate::js_imports::{Block, Transaction, log, Contract};
use crate::state::{HandlerResult, State};


#[wasm_bindgen]
pub struct StateWrapper {
    state: State,
}

lazy_static! {
    static ref STATE: Mutex<StateWrapper> = Mutex::new(
        StateWrapper {
            state: State::default()
        });
}

#[wasm_bindgen()]
pub async fn handle(interaction: JsValue) -> Option<JsValue> {
    log(&format!("Calling handle"));
    log_tx();

    let action = interaction.into_serde();
    if action.is_err() {
        log(&format!("Error {}", action.as_ref().err().unwrap()));
    }

    // not sure about clone here
    let current_state = STATE.lock().unwrap().state.clone();

    let result = match action.unwrap() {
        Action::Transfer { amount, target } => transfer(current_state, amount, target),
        Action::Balance { target } => balance(current_state, target),
        Action::Evolve { value } => evolve(current_state, value),
        Action::ForeignCall { contract_tx_id } => foreign_call(current_state, contract_tx_id).await,
    };

    if result.is_ok() {
        log("Result ok");
        let handler_result = result.as_ref().ok().unwrap();

        return if let HandlerResult::NewState(state) = handler_result {
            log("Setting new state");
            // not sure about clone here
            STATE.lock().unwrap().state = state.clone();
            None
        } else {
            Some(JsValue::from_serde(&result).unwrap())
        };
    } else {
        Some(JsValue::from_serde(&result).unwrap())
    }
}

fn log_tx() {
    log(&format!("calling log_tx"));
    log(&format!("Block indep_hash {}", Block::indep_hash()));
    log(&format!("after indep_hash"));
    log(&format!("Block height {}", Block::height()));
    log(&format!("Block timestamp {}", Block::timestamp()));

    log(&format!("Contract id {}", Contract::id()));
    log(&format!("Contract owner {}", Contract::owner()));

    log(&format!("Transaction id {}", Transaction::id()));
    log(&format!("Transaction owner {}", Transaction::owner()));
    log(&format!("Transaction target {}", Transaction::target()));
}


#[wasm_bindgen(js_name = initState)]
pub fn init_state(state: &JsValue) {
    log(&format!("Calling init state 2"));
    let state_parsed: State =  state.into_serde().unwrap();
    log(&format!("state parsed"));
    STATE.lock().unwrap().state = state_parsed.clone();
    log(&format!("State set {}", state_parsed.ticker));
}

#[wasm_bindgen(js_name = currentState)]
pub fn current_state() -> JsValue {
    log(&format!("Calling current state"));

    // not sure if that's deterministic - which is very important for the execution network.
    // TODO: perf - according to docs:
    // "This is unlikely to be super speedy so it's not recommended for large payload"
    // - we should minimize calls to from_serde
    let current_state = &STATE.lock().unwrap().state;

    JsValue::from_serde(current_state).unwrap()
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

