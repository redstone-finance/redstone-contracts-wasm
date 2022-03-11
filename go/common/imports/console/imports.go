package console

import (
	"github.com/redstone-finance/redstone-contracts-wasm/go/common"
	"syscall/js"
)

func Log(args ...interface{}) {
	importConsole().Call("log", args[0], args[1:])
}

func importConsole() js.Value {
	println(common.GetWasmInstance().ModuleId)
	return js.Global().
		Get("redstone").
		Get("go").
		Get(common.GetWasmInstance().ModuleId).
		Get("imports").
		Get("console")
}
