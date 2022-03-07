package block

import "syscall/js"

func IndepHash() string {
	return importBlock().Call("indep_hash").String()
}

func Height() int {
	return importBlock().Call("height").Int()
}

func Timestamp() int {
	return importBlock().Call("timestamp").Int()
}

func importBlock() js.Value {
	return js.Global().Get("redstone").Get("go").Get("Block")
}
