import { Type, Static } from '@sinclair/typebox'

export type Request = {
  allocation_amount: number
  investor_amounts: {
    name: string
    requested_amount: number
    average_amount: number
  }[]
}

export type InvestorRequest = {
  name: string
  requested_amount: number
  average_amount: number
}

export const InvestorRequest = Type.Object({
  name: Type.String({ minLength: 1 }),
  requested_amount: Type.Number({ minimum: 1 }),
  average_amount: Type.Number({ minimum: 0 }),
})

export type InvestorAllocation = Static<typeof InvestorAllocation>
export const InvestorAllocation = Type.Object({
  name: Type.String({ minLength: 1 }),
  allocation: Type.Number({ minimum: 0 }),
})

export type AllocationRequest = Static<typeof AllocationRequest>
export const AllocationRequest = Type.Object({
  allocation_amount: Type.Number({ minimum: 1 }),
  investor_amounts: Type.Array(InvestorRequest, { minItems: 1 }),
})

export type AllocationResponse = Static<typeof AllocationResponse>
export const AllocationResponse = Type.Object({
  allocations: Type.Array(InvestorAllocation),
})
