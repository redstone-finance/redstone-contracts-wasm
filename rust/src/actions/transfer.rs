use crate::error::ContractError;
use crate::error::ContractError::{CallerBalanceNotEnough, TransferAmountMustBeHigherThanZero};
use crate::state::{State, HandlerResult};
use crate::contract_utils::js_imports::{log, Transaction};

pub fn transfer(mut state: State, qty: u64, target: String) -> Result<HandlerResult, ContractError> {
    log(&format!("Transfer called: {}: {}", target, qty));

    if qty == 0 {
        return Err(TransferAmountMustBeHigherThanZero);
    }

    let caller = Transaction::owner();
    let balances = &mut state.balances;

    // Checking if caller has enough funds
    let caller_balance = *balances.get(&caller).unwrap_or(&0);
    if caller_balance < qty {
        return Err(CallerBalanceNotEnough(caller_balance));
    }

    // Update caller balance
    balances.insert(caller, caller_balance - qty);

    // Update target balance
    let target_balance = *balances.get(&target).unwrap_or(&0);
    balances.insert(target, target_balance + qty);

    // Debug logging
    for (key, value) in &state.balances {
        log(&format!("{}: {}", key, value));
    }

    Ok(HandlerResult::NewState(state))
}
