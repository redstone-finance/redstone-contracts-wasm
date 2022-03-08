package impl

import (
	"errors"
	"fmt"
	"github.com/redstone-finance/redstone-contracts-wasm/go/common/imports/console"
	"github.com/redstone-finance/redstone-contracts-wasm/go/common/imports/smartweave"
	"github.com/redstone-finance/redstone-contracts-wasm/go/common/imports/transaction"
	"github.com/redstone-finance/redstone-contracts-wasm/go/types"
)

func Transfer(state types.PstState, action types.TransferAction) (*types.PstState, error) {
	if action.Qty == 0 {
		return nil, errors.New(fmt.Sprintf("[CE:ITQ] invalid transfer qty: %v", action.Qty))
	}

	caller := transaction.Owner()

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

func Balance(state types.PstState, action types.BalanceAction) (*types.BalanceResult, error) {
	println("balance called")
	if targetBalance, ok := state.Balances[action.Target]; ok {
		return &types.BalanceResult{
			Balance: targetBalance,
		}, nil
	} else {
		return nil, errors.New(fmt.Sprintf("[CE:TNF] target not found: %v", action.Target))
	}
}

func ForeignCall(state types.PstState, action types.ForeignCallAction) (interface{}, error) {
	println("ForeignCall called")
	result := smartweave.ReadContractState(action.ContractTxId)

	console.Log("Result from foreign call", result)

	return result, nil
}
