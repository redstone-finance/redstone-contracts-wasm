package easyjson

//easyjson:json
type PstStateEs struct {
	Ticker    string `json:"ticker"`
	Name      string `json:"name"`
	Owner     string `json:"owner"`
	Evolve    string `json:"evolve"`
	CanEvolve bool   `json:"canEvolve"`
}
