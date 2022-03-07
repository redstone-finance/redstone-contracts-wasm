package demo

import (
	easyjson2 "github.com/redstone-finance/redstone-contracts-wasm/go/easyjson"
	"github.com/redstone-finance/redstone-contracts-wasm/go/imports/console"
	"syscall/js"
)

type AwesomeStruct struct {
	Foo string
	Bar string
}

// Hello https://github.com/tinygo-org/tinygo/issues/447#issuecomment-1061220463
func Hello() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		console.Log("hello")

		pst := easyjson2.PstStateEs{
			Ticker:    "TEST",
			Name:      "name",
			Owner:     "owner",
			CanEvolve: true,
			Evolve:    "sdfsdf",
		}
		console.Log("pst")

		marshaled, _ := pst.MarshalJSON()
		console.Log("pst", string(marshaled))

		pst2 := easyjson2.PstStateEs{}
		pst2.UnmarshalJSON([]byte(
			`{
            "ticker": "EXAMPLE_PST_TOKEN",
            "owner": "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M",
            "canEvolve": true,
            "balances": {
                "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M": 10000000,
                "33F0QHcb22W7LwWR1iRC8Az1ntZG09XQ03YWuw2ABqA": 23111222
            }
        }`))

		console.Log("pst2", pst2.Ticker)

		return nil
	})
}
