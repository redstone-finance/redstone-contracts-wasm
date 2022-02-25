use crate::msg::Interaction;
use crate::error::ContractError;
use crate::js_imports::{block_height, log, read_contract_state};
use crate::state::State;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct JsAsyncResult {
    pub value: String,
}


pub async fn handle_logic(state: &State, interaction: &Interaction) -> Result<State, ContractError> {
    match interaction {
        Interaction::Add { number } => {
            let bad_value: i32 = 9;
            let height = block_height();
            log(&format!("wasm: Add block_height: {}", height));
            if number == &bad_value {
                Err(ContractError::IDontLikeAdd9Err)
            } else {
                Ok(State {
                    counter: state.counter + number,
                })
            }
        }
        Interaction::Subtract { number } => {
            if state.counter - number < 0 {
                Err(
                    ContractError::CounterMustNotBeNegativeErr,
                )
            } else {
                Ok(State {
                    counter: state.counter - number,
                })
            }
        }
        Interaction::ForeignCall { contract_tx_id } => {
            if contract_tx_id == "bad_contract" {
                Err(
                    ContractError::IDontLikeThisContract,
                )
            } else {
                log("wasm: Before Async call");
                let result: JsAsyncResult = read_contract_state(contract_tx_id)
                    .await.into_serde().unwrap();
                log(&format!("wasm: After Async call: {}", result.value));

                Ok(State {
                    counter: state.counter,
                })
            }
        }
    }
}
