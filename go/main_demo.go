package main

import (
	"github.com/redstone-finance/redstone-contracts-wasm/go/demo"
	"syscall/js"
)

func main() {
	js.Global().Set("handle", demo.Hello())

	<-make(chan bool)
}
