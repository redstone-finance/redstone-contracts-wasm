package contract

import (
	"syscall/js"
)

func Id() string {
	return importContract().Call("id").String()
}

func Owner() string {
	return importContract().Call("owner").String()
}

func importContract() js.Value {
	return js.Global().Get("redstone").Get("go").Get("Contract")
}
