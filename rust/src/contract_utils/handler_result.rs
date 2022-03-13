/////////////////////////////////////////////////////
/////////////// DO NOT MODIFY THIS FILE /////////////
/////////////////////////////////////////////////////

use serde::{Deserialize, Serialize};
use crate::state::State;

#[derive(Serialize, Deserialize)]
#[serde(untagged)]
pub enum HandlerResult {
    NewState(State),
    Balance(u64),
}
