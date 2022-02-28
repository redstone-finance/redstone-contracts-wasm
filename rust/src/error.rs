use serde::Serialize;

#[derive(Serialize)]
pub enum ContractError {
  RuntimeError(String),
  TransferAmountMustNotBeNegativeErr,
  IDontLikeThisContract,
  CallerBalanceNotEnough(u64),
}
