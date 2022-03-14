use crate::error::ContractError;
use crate::state::{State, HandlerResult};
use crate::contract_utils::foreign_call::read_foreign_contract_state;

pub async fn foreign_call(mut state: State, contract_tx_id: String) -> Result<HandlerResult, ContractError> {
    if contract_tx_id == "bad_contract" {
        Err(ContractError::IDontLikeThisContract)
    } else {
        let foreign_contract_state: State =
            read_foreign_contract_state(&contract_tx_id).await;

        // Some dummy logic - just for the sake of the integration test
        if foreign_contract_state.ticker == "FOREIGN_PST" {
            for val in state.balances.values_mut() {
                *val += 1000;
            }
        }

        Ok(HandlerResult::NewState(state))
    }
}
