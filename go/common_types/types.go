package common_types

type Action struct {
	Function string `json:"function"`
}

type ActionResult = interface{}

//easyjson:skip
type SwContract[S any] interface {
	Handle(action Action, actionBytes []byte) (*S, ActionResult, error)
	InitState(stateJson string)
	UpdateState(newState *S)
	CurrentState() S
}
