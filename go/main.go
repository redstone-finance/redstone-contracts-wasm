package main

// Import the package to access the Wasm environment
import (
	"encoding/json"
	"syscall/js"
)

type PstState struct {
	Ticker    string            `json:"ticker"`
	Name      string            `json:"name"`
	Owner     string            `json:"owner"`
	Evolve    string            `json:"evolve"`
	CanEvolve bool              `json:"canEvolve"`
	Balances  map[string]uint64 `json:"balances"`
}

// the current state of the contract..at least it's easier than in Rust ;-)
var currentState PstState

func main() {
	// the Go way...standard "exports" from the wasm module do not work here...
	// that's kinda ugly TBH
	js.Global().Set("handle", Handle())
	js.Global().Set("initState", InitState())
	js.Global().Set("currentState", CurrentState())
	js.Global().Set("contractType", ContractType())
	js.Global().Set("lang", Lang())

	// Prevent the function from returning, which is required in a wasm module
	<-make(chan bool)
}

func Handle() js.Func {
	// note: each 'exported' function has to be wrapped into
	// js.FuncOf(func(this js.Value, args []js.Value) interface{}
	// - that's kinda ugly too...
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		actionJson := args[0].String()
		var state PstState
		json.Unmarshal([]byte(actionJson), &state)
		data, _ := json.Marshal(state)

		return string(data)
	})
}

func Lang() interface{} {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return "go/1.0"
	})
}

func CurrentState() interface{} {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		data, _ := json.Marshal(currentState)
		return string(data)
	})
}

func InitState() interface{} {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		stateJson := args[0].String()
		json.Unmarshal([]byte(stateJson), &currentState)
		return nil
	})
}

// ContractType workaround for now to simplify type reading without as/loader or wasm-bindgen
// 1 = assemblyscript
// 2 = rust
// 3 = go
// 4 = swift
// 5 = c
func ContractType() interface{} {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return 3
	})
}
