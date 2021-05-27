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
  // convert to cents
  amount *= 100
  pool = pool.map(({ name, average_amount, requested_amount }) => {
    // convert to cents
    average_amount *= 100
    requested_amount *= 100

    // do not skew the allocation by excessive requests
    requested_amount = Math.min(requested_amount, amount)
    // choose a fair value for new investors with no history
    average_amount ||= requested_amount / pool.length

    return { name, average_amount, requested_amount }
  })

  // rank investors by historical average
  const ranked = ranksFor(pool).map((investor) => {
    // allocate by their ratio relative to the cohorts average
    return setAllocation(investor, amount * investor.status)
  })

  // find remainder after allocation
  const unallocated = amount - sum(ranked.map((v) => v.allocation))
  // find the total of the remaining cohort seeking allocation
  const unallocatedInvestorsDivisor = sum(
    ranked.map((investor) => (isAllocated(investor) ? 0 : investor.status)),
  )

  return ranked.map((investor) => {
    // allocate the remainder to investors by their status
    const allocation = isAllocated(investor)
      ? investor.allocation
      : investor.allocation + unallocated * (investor.status / unallocatedInvestorsDivisor)

    // convert to dollars
    investor.average_amount /= 100
    investor.requested_amount /= 100
    investor = setAllocation(investor, correctFloatingPoint(allocation))

    if (investor.requested_amount < investor.allocation) {
      throw new Error(
        `Investor requested ${investor.requested_amount} but received ${investor.allocation}`,
      )
    }

    return investor
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
  // verify the customer is fully allocated
  return investor.allocation === investor.requested_amount
}

export function correctFloatingPoint(v: number) {
  if (v % 1) {
    v = Number(parseFloat(`${v}`).toPrecision(10))
  }
  return Number(parseFloat(`${v / 100}`).toPrecision(8))
}
