package main

// Import the package to access the Wasm environment
import (
	"encoding/json"
	"errors"
	"github.com/redstone-finance/redstone-contracts-wasm/go/types"
	"syscall/js"
)

// the current state of the contract..at least it's easier than in Rust ;-)
var currentState types.PstState

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

// the function that contract developers actually need to implement
func doHandle(action types.Action) (interface{}, error) {
	switch {
	case action.Function == "transfer":
		return "transfer", nil
	case action.Function == "balance":
		return "balance", nil
	case action.Function == "evolve":
		return "evolve", nil
	default:
		return nil, errors.New("[RE:WTF] unknown function")
	}
}

func Handle() js.Func {
	// note: each 'exported' function has to be wrapped into
	// js.FuncOf(func(this js.Value, args []js.Value) interface{}
	// - that's kinda ugly too...
	return js.FuncOf(func(this js.Value, handleArgs []js.Value) interface{} {

		promisifiedHandler := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
			resolve := args[0]
			reject := args[1]

			go func() {
				actionJson := handleArgs[0].String()
				var action types.Action
				json.Unmarshal([]byte(actionJson), &action)
				_, err := json.Marshal(action)

				result, err := doHandle(action)

				if err != nil {
					// err should be an instance of `error`, eg `errors.New("some error")`
					errorConstructor := js.Global().Get("Error")
					errorObject := errorConstructor.New(err.Error())
					reject.Invoke(errorObject)
				} else {
					resolve.Invoke(result)
				}
			}()

			return nil
		})

		promiseConstructor := js.Global().Get("Promise")
		return promiseConstructor.New(promisifiedHandler)
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
