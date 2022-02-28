use serde::Deserialize;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", tag = "function")]
pub enum Action {
    Transfer {
        amount: u64,
        target: String,
    },
    /*Balance {
        target: String
    },
    Evolve {
        value: String
    }*/
}
