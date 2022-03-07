package impl

//easyjson:json
type PstState struct {
	Ticker    string            `json:"ticker"`
	Name      string            `json:"name"`
	Owner     string            `json:"owner"`
	Evolve    string            `json:"evolve"`
	CanEvolve bool              `json:"canEvolve"`
	Balances  map[string]uint64 `json:"balances"`
}

type Action struct {
	Function string `json:"function"`
}

type TransferAction struct {
	Function string `json:"function"`
	Target   string `json:"target"`
	Qty      uint64 `json:"qty"`
}

type EvolveAction struct {
	Action
	Value string `json:"target"`
}

type BalanceAction struct {
	Action
	Target string `json:"target"`
}

type ForeignCallAction struct {
	Action
	ContractTxId string `json:"contractTxId"`
}

type BalanceResult struct {
	Balance uint64 `json:"balance"`
}

type ActionResult = interface{}
