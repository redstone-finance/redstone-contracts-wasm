package impl

import (
	"errors"
	"fmt"
	"github.com/redstone-finance/redstone-contracts-wasm/go/common/imports/block"
	"github.com/redstone-finance/redstone-contracts-wasm/go/common/imports/console"
	"github.com/redstone-finance/redstone-contracts-wasm/go/common_types"
	"github.com/redstone-finance/redstone-contracts-wasm/go/types"
)

type PstContract struct {
	state types.PstState
}

// Handle the function that contract developers actually need to implement
func (c *PstContract) Handle(action common_types.Action, actionBytes []byte) (*types.PstState, common_types.ActionResult, error) {
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
		var transfer types.TransferAction
		err := transfer.UnmarshalJSON(actionBytes)
		if err != nil {
			return nil, nil, err
		}
		state, err := Transfer(c.CloneState(), transfer)
		return state, nil, err
	case "balance":
		var balance types.BalanceAction
		err := balance.UnmarshalJSON(actionBytes)
		if err != nil {
			return nil, nil, err
		}
		result, err := Balance(c.CloneState(), balance)
		return nil, result, err
	case "foreignCall":
		var foreignCall types.ForeignCallAction
		err := foreignCall.UnmarshalJSON(actionBytes)
		if err != nil {
			return nil, nil, err
		}
		result, err := ForeignCall(c.CloneState(), foreignCall)
		return nil, result, err
	default:
		return nil, nil, errors.New(fmt.Sprintf("[RE:WTF] unknown function: %v", fn))
	}
}

func (c *PstContract) InitState(stateJson string) {
	var state types.PstState
	err := state.UnmarshalJSON([]byte(stateJson))
	if err != nil {
		return // TODO: throw in a similar way as in handle
	}
	c.UpdateState(&state)
}

func (c *PstContract) UpdateState(newState *types.PstState) {
	c.state = *newState
}

func (c *PstContract) CurrentState() types.PstState {
	return c.state
}

// CloneState TODO: discuss whether it is necessary
// it allows to make the given action transactional, but
// at the cost of performance
func (c *PstContract) CloneState() types.PstState {
	json, _ := c.state.MarshalJSON()
	state := types.PstState{}
	err := state.UnmarshalJSON(json)
	if err != nil {
		// TODO: return error
		return types.PstState{}
	}

	return state
}
