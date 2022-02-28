use crate::error::ContractError;
use crate::js_imports::log;
use crate::state::{HandlerResult, State};

pub fn balance(state: State, target: String) -> Result<HandlerResult, ContractError> {
    // TODO: add some validation...
    log("Balance called");

    Ok(HandlerResult::Balance(*state.balances.get(&target).unwrap()))
}
