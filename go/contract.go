package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/redstone-finance/redstone-contracts-wasm/go/actions"
	"github.com/redstone-finance/redstone-contracts-wasm/go/common"
	"github.com/redstone-finance/redstone-contracts-wasm/go/types"
	"syscall/js"
)

// the current state of the contract that contract developers have to define
var currentState types.PstState

// the function that contract developers actually need to implement
func doHandle(action map[string]interface{}) (interface{}, error) {
	fn := action["function"]
	switch fn {
	case "transfer":
		// not sure how to "automatically" handle casting to concrete type in Go.
		// https://eagain.net/articles/go-json-kind/
		// https://eagain.net/articles/go-dynamic-json/
		var transfer types.TransferAction
		common.ConvertInto(action, &transfer)
		actions.Transfer(&currentState, transfer)
		return transfer.Target, nil
	case "evolve":
		return "evolve", nil
	case "balance":
		return "balance", nil
	default:
		return nil, errors.New(fmt.Sprintf("[RE:WTF] unknown function: %v", fn))
	}
}

// low-level WASM code...should be somehow hidden from the contract developer
func main() {
	// the Go way of defining WASM exports...
	// standard "exports" from the wasm module do not work here...
	// that's kinda ugly TBH
	js.Global().Set("handle", Handle())
	js.Global().Set("initState", InitState())
	js.Global().Set("currentState", CurrentState())
	js.Global().Set("contractType", ContractType())
	js.Global().Set("lang", Lang())

	// Prevent the function from returning, which is required in a wasm module
	// i.e. "Error: Go program has already exited" is thrown
	<-make(chan bool)
}

func Handle() js.Func {
	// note: each 'exported' function has to be wrapped into
	// js.FuncOf(func(this js.Value, args []js.Value) interface{}
	// - that's kinda ugly too...
	return js.FuncOf(func(this js.Value, handleArgs []js.Value) interface{} {

		// exception handling
		promisifiedHandler := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
			resolve := args[0]
			reject := args[1]

			go func() {
				actionJson := handleArgs[0].String()
				var action map[string]interface{}
				json.Unmarshal([]byte(actionJson), &action)
				_, err := json.Marshal(action)

				if err != nil {
					doReject(err, reject)
				}

				result, err := doHandle(action)

				if err != nil {
					// err should be an instance of `error`, eg `errors.New("some error")`
					doReject(err, reject)
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

func doReject(err error, reject js.Value) {
	errorConstructor := js.Global().Get("Error")
	errorObject := errorConstructor.New(err.Error())
	reject.Invoke(errorObject)
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
