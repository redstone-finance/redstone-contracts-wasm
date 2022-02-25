use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

#[wasm_bindgen(module = "/smartweave_imports.js")]
extern "C" {
    #[wasm_bindgen(js_namespace = Block, js_name = indep_hash)]
    pub fn block_indep_hash() -> String;

    #[wasm_bindgen(js_namespace = Block, js_name = height)]
    pub fn block_height() -> i32;

    #[wasm_bindgen(js_namespace = SmartWeave, js_name = readContractState)]
    pub async fn read_contract_state(contract_id: &str) -> JsValue;
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}
