use serde::de::DeserializeOwned;
use crate::contract_utils::js_imports::SmartWeave;

pub async fn read_foreign_contract_state<T: DeserializeOwned>(contract_address: &String) -> T {
  let state: T = SmartWeave::read_contract_state(contract_address)
    .await
    .into_serde()
    .unwrap();

  return state;
}
