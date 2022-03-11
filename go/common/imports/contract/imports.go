package contract

import (
	"github.com/redstone-finance/redstone-contracts-wasm/go/common"
	"syscall/js"
)

func Id() string {
	return importContract().Call("id").String()
}

func Owner() string {
	return importContract().Call("owner").String()
}

func importContract() js.Value {
	return js.Global().
		Get("redstone").
		Get("go").
		Get(common.GetWasmInstance().ModuleId).
		Get("imports").
		Get("Contract")
}
