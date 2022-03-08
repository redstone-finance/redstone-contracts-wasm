package main

import (
	"github.com/redstone-finance/redstone-contracts-wasm/go/common"
	"github.com/redstone-finance/redstone-contracts-wasm/go/common_types"
	"github.com/redstone-finance/redstone-contracts-wasm/go/impl"
	"github.com/redstone-finance/redstone-contracts-wasm/go/types"
)

// the current state of the contract that contract developers have to define
var contract = impl.PstContract{}

// handles all the WASM-JS related trickery...
func main() {
	var swContract common_types.SwContract[types.PstState] = &contract
	common.Run(swContract)
}
