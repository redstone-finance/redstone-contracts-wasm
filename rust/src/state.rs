use std::collections::HashMap;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(untagged)]
pub enum HandlerResult {
    NewState(State),
    Balance(u64),
}


#[derive(Serialize, Deserialize, Clone, Default)]
pub struct State {
    pub ticker: String,
    pub name: String,
    pub owner: String,
    pub balances: HashMap<String, u64>,
}
