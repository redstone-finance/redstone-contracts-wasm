package common_types

type Action struct {
	Function string `json:"function"`
}

type ActionResult = interface{}

//easyjson:skip
type SwContract interface {
}
