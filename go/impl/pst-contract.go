package impl

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/redstone-finance/redstone-contracts-wasm/go/common"
	"github.com/redstone-finance/redstone-contracts-wasm/go/imports/block"
	"github.com/redstone-finance/redstone-contracts-wasm/go/imports/console"
)

type PstContract struct {
	state PstState
}

// Handle the function that contract developers actually need to implement
func (c *PstContract) Handle(action map[string]interface{}) (*PstState, ActionResult, error) {
	fn := action["function"]

	console.Log("Calling", fn)

	console.Log("Block height", block.Height())
	console.Log("Block indep_hash", block.IndepHash())
	console.Log("Block timestamp", block.Timestamp())

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

func (c *PstContract) InitState(stateJson string) {
	var state PstState
	json.Unmarshal([]byte(stateJson), &state)
	c.UpdateState(&state)
}

func (c *PstContract) UpdateState(newState *PstState) {
	c.state = *newState
}

func (c *PstContract) CurrentState() PstState {
	return c.state
}

func (c *PstContract) CloneState() PstState {
	var clone PstState
	common.DeepCopy(c.state, &clone)
	return clone
}
