import type { InvestorRequest } from '../shared/schema'
import { sum } from './tools'

type RankedInvestor = InvestorRequest & {
  status: number
}

type AllocatedInvestor = InvestorRequest &
  RankedInvestor & {
    allocation: number
  }

export function allocate(pool: InvestorRequest[], amount: number) {
  const ranked = ranksFor(pool).map((investor) => {
    return setAllocation(investor, amount * investor.status)
  })

  const unallocated = amount - sum(ranked.map((v) => v.allocation))
  const unallocatedInvestorsDivisor = sum(
    ranked.map((investor) => (isAllocated(investor) ? 0 : investor.status)),
  )

  return ranked.map((investor) => {
    const allocation = isAllocated(investor)
      ? investor.allocation
      : investor.allocation + unallocated * (investor.status / unallocatedInvestorsDivisor)

    return setAllocation(investor, correctFloatingPoint(allocation))
  })
}

function ranksFor(pool: InvestorRequest[]): RankedInvestor[] {
  const averageSum = sum(pool.map((v) => v.average_amount))

  return pool.map((investor) => {
    const status = investor.average_amount / averageSum

    return { ...investor, status }
  })
}

function setAllocation<T extends InvestorRequest>(investor: T, value: number) {
  const allocation = Math.min(investor.requested_amount, value)

  return { ...investor, allocation }
}

function isAllocated(investor: AllocatedInvestor) {
  return investor.allocation === investor.requested_amount
}

export function correctFloatingPoint(v: number) {
  return Number(parseFloat(`${v}`).toPrecision(8))
}
