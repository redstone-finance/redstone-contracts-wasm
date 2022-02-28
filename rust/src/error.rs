use serde::Serialize;

#[derive(Serialize)]
pub enum ContractError {
  RuntimeError(String),
  TransferAmountMustNotBeNegativeErr,
  CallerBalanceNotEnough(u64),
}
