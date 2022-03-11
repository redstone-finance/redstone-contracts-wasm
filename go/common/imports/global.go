package imports

import (
	"github.com/redstone-finance/redstone-contracts-wasm/go/common"
	"syscall/js"
)

func RedStone() js.Value {
	return js.Global().
		Get("redstone").
		Get("go").
		Get(common.GetWasmInstance().ModuleId).
		Get("imports")
}
