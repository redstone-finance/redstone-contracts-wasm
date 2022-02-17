@serializable
export class StateSchema {
  firstName: string
  lastName: string
  counter: i32
}


@serializable
export class ActionSchema {
  function: string
}


@serializable
export class ResultSchema {
  fullName: string
}


@serializable
export class SmartweaveSchema {
  contract: ContractSchema
  sender: string
  block: BlockSchema
  transaction: TransactionSchema
}


@serializable
export class BlockSchema {
  height: i32
  indep_hash: string
  timestamp: i32
}

@serializable
export class TransactionSchema {
  id: string
  owner: string
  target: string
}

@serializable
export class ContractSchema {
  id: string
  owner: string
}


@serializable
export class HandlerResultSchema {
  state: StateSchema
  result: ResultSchema | null
}
