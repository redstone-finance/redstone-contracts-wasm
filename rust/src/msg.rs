use serde::Deserialize;

#[derive(Deserialize)]
pub enum Interaction {
    Add {
        number: i32,
    },
    Subtract {
        number: i32,
    },
    ForeignCall {
        contract_tx_id: String
    }
}
