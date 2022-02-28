use crate::error::ContractError;
use crate::js_imports::{log, SmartWeave};
use crate::state::{HandlerResult, State};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct JsAsyncResult {
    pub value: String,
}

pub async fn foreign_call(state: State, contract_tx_id: String) -> Result<HandlerResult, ContractError> {
    if contract_tx_id == "bad_contract" {
        Err(
            ContractError::IDontLikeThisContract,
        )
    } else {
        log("wasm: Before Async call");
        let result: JsAsyncResult = SmartWeave::read_contract_state(&contract_tx_id)
            .await.into_serde().unwrap();
        log(&format!("wasm: After Async call: {}", result.value));

        Ok(HandlerResult::NewState(state))
    }
}
