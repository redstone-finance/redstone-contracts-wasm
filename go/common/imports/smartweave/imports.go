package smartweave

import (
	"github.com/redstone-finance/redstone-contracts-wasm/go/common"
	"github.com/redstone-finance/redstone-contracts-wasm/go/common/imports"
	"syscall/js"
)

func ReadContractState(contractTxId string) js.Value {
	promise := importSmartWeave().Call("readContractState", contractTxId).JSValue()
	result, _ := common.Await(promise)

	return result[0]
}

func importSmartWeave() js.Value {
	return imports.RedStone().Get("SmartWeave")
}
