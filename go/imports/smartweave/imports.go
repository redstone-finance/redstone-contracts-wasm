package smartweave

import (
	"syscall/js"
)

func ReadContractState(contractTxId string) string {
	return importTransaction().Call("readContractState", contractTxId).String()
}

func importTransaction() js.Value {
	return js.Global().Get("redstone").Get("go").Get("SmartWeave")
}
