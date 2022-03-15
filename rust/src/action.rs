use serde::{Deserialize, Serialize};
use crate::contract_utils::handler_result::HandlerResult;
use crate::state::State;
use crate::error::ContractError;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", tag = "function")]
pub enum Action {
    Transfer {
        qty: u64,
        target: String,
    },
    Balance {
        target: String
    },
    Evolve {
        value: String
    },
    ForeignCall {
        contract_tx_id: String
    }
}

#[derive(Serialize, Deserialize)]
pub enum QueryResponseMsg {
    Balance(u64),
}

pub type ActionResult = Result<HandlerResult<State, QueryResponseMsg>, ContractError>;
