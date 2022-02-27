use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

#[wasm_bindgen(module = "/smartweave_imports.js")]
extern "C" {
    #[wasm_bindgen]
    pub type Block;

    #[wasm_bindgen(static_method_of = Block)]
    pub fn indep_hash() -> String;

    #[wasm_bindgen(static_method_of = Block)]
    pub fn height() -> i32;

    #[wasm_bindgen(static_method_of = Block)]
    pub fn timestamp() -> i32;

    #[wasm_bindgen]
    pub type Contract;

    #[wasm_bindgen(static_method_of = Contract)]
    pub fn id() -> i32;

    #[wasm_bindgen(static_method_of = Contract)]
    pub fn owner() -> String;

    #[wasm_bindgen]
    pub type Transaction;

    #[wasm_bindgen(static_method_of = Transaction, js_name = id)]
    pub fn tx_id() -> i32;

    #[wasm_bindgen(static_method_of = Transaction, js_name = owner)]
    pub fn tx_owner() -> String;

    #[wasm_bindgen(static_method_of = Transaction, js_name = target)]
    pub fn target() -> String;

    #[wasm_bindgen(js_namespace = SmartWeave, js_name = readContractState)]
    pub async fn read_contract_state(contract_id: &str) -> JsValue;
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}
