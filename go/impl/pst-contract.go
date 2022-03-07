package impl

import (
	"errors"
	"fmt"
	"github.com/redstone-finance/redstone-contracts-wasm/go/easyjson"
	"github.com/redstone-finance/redstone-contracts-wasm/go/imports/block"
	"github.com/redstone-finance/redstone-contracts-wasm/go/imports/console"
)

type PstContract struct {
	state easyjson.PstState
}

// Handle the function that contract developers actually need to implement
func (c *PstContract) Handle(action easyjson.Action, actionBytes []byte) (*easyjson.PstState, easyjson.ActionResult, error) {
	fn := action.Function

	console.Log("Calling", fn)

	console.Log("Block height", block.Height())
	console.Log("Block indep_hash", block.IndepHash())
	console.Log("Block timestamp", block.Timestamp())

	switch fn {
	case "transfer":
		// not sure how to "automatically" handle casting to concrete action impl in Go.
		// https://eagain.net/articles/go-json-kind/
		// https://eagain.net/articles/go-dynamic-json/
		var transfer easyjson.TransferAction
		transfer.UnmarshalJSON(actionBytes)
		state, err := Transfer(c.CloneState(), transfer)
		return state, nil, err
	case "balance":
		var balance easyjson.BalanceAction
		balance.UnmarshalJSON(actionBytes)
		result, err := Balance(c.CloneState(), balance)
		return nil, result, err
	case "foreignCall":
		var foreignCall easyjson.ForeignCallAction
		foreignCall.UnmarshalJSON(actionBytes)
		result, err := ForeignCall(c.CloneState(), foreignCall)
		return nil, result, err
	default:
		return nil, nil, errors.New(fmt.Sprintf("[RE:WTF] unknown function: %v", fn))
	}
}

func (c *PstContract) InitState(stateJson string) {
	var state easyjson.PstState
	state.UnmarshalJSON([]byte(stateJson))
	//json.Unmarshal([]byte(stateJson), &state)
	c.UpdateState(&state)
}

func (c *PstContract) UpdateState(newState *easyjson.PstState) {
	c.state = *newState
}

func (c *PstContract) CurrentState() easyjson.PstState {
	return c.state
}

// CloneState TODO: discuss whether it is necessary
// it allows to make the given action transactional, but
// at the cost of performance
func (c *PstContract) CloneState() easyjson.PstState {
	json, _ := c.state.MarshalJSON()
	state := easyjson.PstState{}
	state.UnmarshalJSON(json)

	return state
}
