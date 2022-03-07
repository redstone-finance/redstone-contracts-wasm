package impl

import (
	"encoding/json"
	"github.com/redstone-finance/redstone-contracts-wasm/go/common"
	"syscall/js"
)

type Contract struct {
	state PstState
}

func (c *Contract) InitState(newState js.Value) {
	stateJson := newState.String()
	var state PstState
	json.Unmarshal([]byte(stateJson), &state)
	c.UpdateState(&state)
}

func (c *Contract) UpdateState(newState *PstState) {
	c.state = *newState
}

func (c *Contract) CurrentState() PstState {
	return c.state
}

func (c *Contract) CloneState() PstState {
	var clone PstState
	common.DeepCopy(c.state, &clone)
	return clone
}
