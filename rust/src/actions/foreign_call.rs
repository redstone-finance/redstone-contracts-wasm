use crate::error::ContractError;
use crate::state::{State, HandlerResult};
use crate::contract_utils::js_imports::log;
use crate::contract_utils::foreign_call::read_foreign_contract_state;

pub async fn foreign_call(mut state: State, contract_tx_id: String) -> Result<HandlerResult, ContractError> {
    log(&format!("foreign_call: {}", contract_tx_id));
    if contract_tx_id == "bad_contract" {
        Err(ContractError::IDontLikeThisContract)
    } else {
        log("Before Async call");

        let foreign_contract_state: State =
            read_foreign_contract_state(&contract_tx_id).await;

        log(&format!("After Async call: {}", foreign_contract_state.ticker));

        // Some dummy logic - just for the sake of the integration test
        if foreign_contract_state.ticker == "FOREIGN_PST" {
            for val in state.balances.values_mut() {
                *val += 1000;
            }
        }

        Ok(HandlerResult::NewState(state))
    }
}
