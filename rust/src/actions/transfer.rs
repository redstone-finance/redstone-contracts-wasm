use crate::error::ContractError;
use crate::error::ContractError::{CallerBalanceNotEnough, TransferAmountMustNotBeNegativeErr};
use crate::js_imports::Transaction;
use crate::state::{HandlerResult, State};

pub fn transfer(mut state: State, amount: u64, target: String) -> Result<HandlerResult, ContractError> {
    if amount == 0 {
        return Err(TransferAmountMustNotBeNegativeErr);
    }

    let caller = Transaction::owner();

    let balances = &mut state.balances;
    let caller_balance = balances.get_mut(&caller).unwrap();

    if *caller_balance < amount {
        return Err(CallerBalanceNotEnough(*caller_balance));
    }

    *caller_balance -= amount;

    if balances.contains_key(&target) {
        *balances.get_mut(&target).unwrap() += amount;
    } else {
        balances.insert(target, amount);
    };

    Ok(HandlerResult::NewState(state))
}
