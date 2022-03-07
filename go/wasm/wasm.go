package wasm

import (
	"encoding/json"
	"github.com/redstone-finance/redstone-contracts-wasm/go/impl"
	"syscall/js"
)

func Run(contract *impl.Contract) {
	// the Go way of defining WASM exports...
	// standard "exports" from the wasm module do not work here...
	// that's kinda ugly TBH
	js.Global().Set("handle", handle(contract))
	js.Global().Set("initState", initState(contract))
	js.Global().Set("currentState", currentState(contract))
	js.Global().Set("contractType", contractType())
	js.Global().Set("lang", lang())

	// Prevent the function from returning, which is required in a wasm module
	// i.e. "Error: Go program has already exited" is thrown otherwise on host
	<-make(chan bool)
}

func handle(contract *impl.Contract) js.Func {
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

				state, result, err := contract.Handle(action)

				if err != nil {
					// err should be an instance of `error`, eg `errors.New("some error")`
					doReject(err, reject)
				} else {
					if state != nil {
						contract.UpdateState(state)
					}
					resultMarshalled, _ := json.Marshal(result)
					resolve.Invoke(string(resultMarshalled))
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

func lang() interface{} {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return "go/1.0"
	})
}

func currentState(contract *impl.Contract) interface{} {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		data, _ := json.Marshal(contract.CurrentState())
		return string(data)
	})
}

func initState(contract *impl.Contract) interface{} {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		contract.InitState(args[0].String())
		return nil
	})
}

// ContractType workaround for now to simplify type reading without as/loader or wasm-bindgen
// 1 = assemblyscript
// 2 = rust
// 3 = go
// 4 = swift
// 5 = c
func contractType() interface{} {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return 3
	})
}
