use crate::action::{Action, HandlerResult};
use crate::error::ContractError;
use crate::js_imports::{Block, log, SmartWeave};
use crate::state::State;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct JsAsyncResult {
    pub value: String,
}


pub async fn handle_logic(state: &mut State, interaction: &Action) -> Result<HandlerResult<State, State>, ContractError> {
    let result =  match interaction {
        Action::Add { number } => {
            let bad_value: i32 = 9;
            let height = Block::height();
            log(&format!("wasm: Add block_height: {}", height));
            if number == &bad_value {
                Err(ContractError::IDontLikeAdd9Err)
            } else {
                state.counter += number;
                Ok(State::new(state))
            }
        }
        Action::Subtract { number } => {
            if state.counter - number < 0 {
                Err(ContractError::CounterMustNotBeNegativeErr)
            } else {
                Ok(State {
                    counter: state.counter - number,
                })
            }
        }
        Action::ForeignCall { contract_tx_id } => {
            if contract_tx_id == "bad_contract" {
                Err(ContractError::IDontLikeThisContract)
            } else {
                log("wasm: Before Async call");
                let result: JsAsyncResult = SmartWeave::read_contract_state(contract_tx_id)
                    .await.into_serde().unwrap();
                log(&format!("wasm: After Async call: {}", result.value));

                Ok(State {
                    counter: state.counter,
                })
            }
        }
    }
}
