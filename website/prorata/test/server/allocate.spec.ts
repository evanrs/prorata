import { AllocationRequest } from '../../shared'
import { allocate } from '../../server'
import { data, outputFor } from '../data'

describe('Proration', () => {
  it('allocates based on historical average', () => {
    const [a, b, c, d] = data
    expect(resultFor(a.input)).toEqual(a.output)
    expect(resultFor(b.input)).toEqual(b.output)
    expect(resultFor(c.input)).toEqual(c.output)
    expect(resultFor(d.input)).toEqual(d.output)
    expect(
      resultFor({
        allocation_amount: 1000,
        investor_amounts: [
          { name: 'a', requested_amount: 100, average_amount: 100 },
          { name: 'b', requested_amount: 25, average_amount: 25 },
          { name: 'c', requested_amount: 25, average_amount: 25 },
        ],
      })
    ).toEqual({ a: 100, b: 25, c: 25 })

    expect(
      resultFor({
        allocation_amount: 149,
        investor_amounts: [
          { name: 'a', requested_amount: 100, average_amount: 100000 },
          { name: 'b', requested_amount: 25, average_amount: 24 },
          { name: 'c', requested_amount: 25, average_amount: 25 },
        ],
      })
    ).toEqual({ a: 100, b: 24, c: 25 })
  })
})

function resultFor({
  allocation_amount: total,
  investor_amounts: pool,
}: AllocationRequest) {
  return outputFor({ allocations: allocate(pool, total) })
}
