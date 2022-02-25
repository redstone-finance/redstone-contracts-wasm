use serde::Serialize;

#[derive(Serialize)]
pub enum ContractError {
  CounterMustNotBeNegativeErr,
  IDontLikeAdd9Err,
  IDontLikeThisContract,
}
