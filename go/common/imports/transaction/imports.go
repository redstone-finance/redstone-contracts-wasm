package transaction

import (
	"syscall/js"
)

func Id() string {
	return importTransaction().Call("id").String()
}

func Owner() string {
	return importTransaction().Call("owner").String()
}

func Target() string {
	return importTransaction().Call("target").String()
}

func importTransaction() js.Value {
	return js.Global().Get("redstone").Get("go").Get("Transaction")
}
