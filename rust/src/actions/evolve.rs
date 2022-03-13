use crate::error::ContractError;
use crate::error::ContractError::{EvolveNotAllowed, OnlyOwnerCanEvolve};
use crate::state::{State, HandlerResult};
use crate::contract_utils::js_imports::Transaction;

pub fn evolve(mut state: State, value: String) -> Result<HandlerResult, ContractError> {
    match state.can_evolve {
        Some(can_evolve) => if can_evolve && state.owner == Transaction::owner() {
            state.evolve = Option::from(value);
            Ok(HandlerResult::NewState(state))
        } else {
            Err(OnlyOwnerCanEvolve)
        },
        None => Err(EvolveNotAllowed),
    }
}
