use std::borrow::{Borrow};
use wasm_bindgen::prelude::*;

use crate::state::State;
use crate::msg::Interaction;
use crate::execute::handle_logic;
use crate::js_imports::{block_height, block_indep_hash, log};

// https://stackoverflow.com/questions/51216284/how-to-store-global-state-in-rust-when-using-wasm-bindgen

// this does not work
// static mut STATE: State = State::default();

// manual initialization sucks...
static mut STATE: State = State {
    counter: 0
};

#[wasm_bindgen()]
pub async fn handle(interaction: JsValue) -> JsValue {
    log(&format!("Block height {}", block_height()));
    log(&format!("Block indep hash {}", block_indep_hash()));

    let interaction: Interaction = interaction.into_serde().unwrap();

    let current_state = unsafe { STATE.borrow() };

    let result_after_interaction= handle_logic(current_state, &interaction).await;

    if result_after_interaction.is_ok() {
        let state = result_after_interaction.ok();

        unsafe {
            STATE = state.as_ref().unwrap().clone();
        }
        
        return JsValue::from_serde(&state).unwrap();
    }

    JsValue::from_serde(&result_after_interaction.err()).unwrap()
}


#[wasm_bindgen(js_name = initState)]
pub fn init_state(state: &JsValue) {
    log(&format!("Calling init state"));

    unsafe {
        STATE = state.into_serde().unwrap();
    };
}


#[wasm_bindgen(js_name = currentState)]
pub fn current_state() -> JsValue {
    log(&format!("Calling current state"));
    let current_state = unsafe { STATE.borrow() };

    JsValue::from_serde(&current_state).unwrap()
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

