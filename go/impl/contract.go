package impl

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/redstone-finance/redstone-contracts-wasm/go/common"
)

type Contract struct {
	state PstState
}

// Handle the function that contract developers actually need to implement
func (c *Contract) Handle(action map[string]interface{}) (*PstState, ActionResult, error) {
	fn := action["function"]

	switch fn {
	case "transfer":
		// not sure how to "automatically" handle casting to concrete action impl in Go.
		// https://eagain.net/articles/go-json-kind/
		// https://eagain.net/articles/go-dynamic-json/
		var transfer TransferAction
		common.ConvertInto(action, &transfer)
		state, err := Transfer(c.CloneState(), transfer)
		return state, nil, err
	case "balance":
		var balance BalanceAction
		common.ConvertInto(action, &balance)
		result, err := Balance(c.CloneState(), balance)
		return nil, result, err
	default:
		return nil, nil, errors.New(fmt.Sprintf("[RE:WTF] unknown function: %v", fn))
	}
}

func (c *Contract) InitState(stateJson string) {
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
