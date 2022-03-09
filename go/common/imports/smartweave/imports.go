package smartweave

import (
	"github.com/redstone-finance/redstone-contracts-wasm/go/common"
	"syscall/js"
)

func ReadContractState(contractTxId string) js.Value {
	promise := importSmartWeave().Call("readContractState", contractTxId)
	result, _ := common.Await(promise)

	return result[0]
}

func importSmartWeave() js.Value {
	return js.Global().Get("redstone").Get("go").Get("SmartWeave")
}
