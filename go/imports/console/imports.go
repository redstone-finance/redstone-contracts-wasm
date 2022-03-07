package console

import (
	"fmt"
	"syscall/js"
)

func Log(args ...interface{}) {
	importConsole().Call("log", fmt.Sprintf("[WASM]: %v", args[0]), args[1:])
}

func importConsole() js.Value {
	return js.Global().Get("redstone").Get("go").Get("console")
}

func importTransaction() js.Value {
	return js.Global().Get("redstone").Get("go").Get("Transaction")
}

func importContract() js.Value {
	return js.Global().Get("redstone").Get("go").Get("Contract")
}

func importSmartWeave() js.Value {
	return js.Global().Get("redstone").Get("go").Get("SmartWeave")
}
