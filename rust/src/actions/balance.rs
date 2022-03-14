use crate::error::ContractError;
use crate::error::ContractError::WalletHasNoBalanceDefined;
use crate::state::{State, HandlerResult};

pub fn balance(state: State, target: String) -> Result<HandlerResult, ContractError> {
    if !state.balances.contains_key(&target) {
        Err(WalletHasNoBalanceDefined(target))
    } else {
        Ok(HandlerResult::Balance(*state.balances.get(&target).unwrap()))
    }
}
