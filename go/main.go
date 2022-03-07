package main

import (
	"github.com/redstone-finance/redstone-contracts-wasm/go/impl"
	"github.com/redstone-finance/redstone-contracts-wasm/go/wasm"
)

// the current state of the contract that contract developers have to define
var contract = impl.Contract{}

// handles all the WASM-JS related trickery...
func main() {
	wasm.Run(&contract)
}
