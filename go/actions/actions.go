package actions

import (
	"errors"
	"fmt"
	"github.com/redstone-finance/redstone-contracts-wasm/go/impl"
)

func Transfer(state impl.PstState, action impl.TransferAction) (*impl.PstState, error) {
	if action.Qty == 0 {
		return nil, errors.New(fmt.Sprintf("[CE:ITQ] invalid transfer qty: %v", action.Qty))
	}

	// TODO - from wasm import Transaction.owner()
	caller := "33F0QHcb22W7LwWR1iRC8Az1ntZG09XQ03YWuw2ABqA"

	if callerBalance, ok := state.Balances[caller]; ok {
		if callerBalance < action.Qty {
			return nil, errors.New(fmt.Sprintf("[CE:CBNE] caller balance not enough: %v", state.Balances[caller]))
		}

		callerBalance -= action.Qty
		state.Balances[caller] = callerBalance

		if targetBalance, ok := state.Balances[action.Target]; ok {
			targetBalance += action.Qty
			state.Balances[action.Target] = targetBalance
		} else {
			state.Balances[action.Target] = action.Qty
		}

	} else {
		return nil, errors.New(fmt.Sprintf("[CE:CNF] caller not found: %v", caller))
	}

	return &state, nil
}

func Balance(state impl.PstState, action impl.BalanceAction) (interface{}, error) {
	if targetBalance, ok := state.Balances[action.Target]; ok {
		return targetBalance, nil
	} else {
		return nil, errors.New(fmt.Sprintf("[CE:TNF] target not found: %v", action.Target))
	}
}
