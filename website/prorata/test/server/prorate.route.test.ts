import type { AllocationRequest } from '../../server'

import { data } from '../data'
import { createInjector } from '../tools'

type PartialAllocationRequest = {
  allocation_amount?: AllocationRequest['allocation_amount']
  investor_amounts?: Partial<AllocationRequest['investor_amounts'][number]>[]
}

describe('Prorate Route', () => {
  // will make calls to the api as POST /prorate
  const inject = createInjector<PartialAllocationRequest | undefined>({
    method: 'POST',
    path: '/prorate',
  })

  test('properly validates input', async () => {
    const [sample] = data

    // test that it works as excepted, we test the logic elsewhere
    const valid = await inject({ payload: sample.request })
    expect(valid.statusCode).toBe(200)
    expect(valid.json()).toEqual(sample.response)

    // validate its error handling for bad input
    expect(await inject.snapshotFor()).toMatchSnapshot('Missing Payload')
    expect(await inject.snapshotFor({})).toMatchSnapshot('Empty Payload')
    expect(
      await inject.snapshotFor({
        allocation_amount: 0,
      })
    ).toMatchSnapshot('Zero Allocation')
    expect(
      await inject.snapshotFor({
        investor_amounts: [{ requested_amount: 0 }],
      })
    ).toMatchSnapshot('Zero Requested')

    // TODO validate its error handling for logical issues
    const invalid = await inject.snapshotFor({
      allocation_amount: 1,
      investor_amounts: [
        { name: 'a', average_amount: 0, requested_amount: 1 },
        { name: 'b', average_amount: 0, requested_amount: 1 },
      ],
    })

    expect(invalid).toMatchSnapshot('Logically Impossible')
    expect(invalid.error).toBe('Internal Server Error')
  })
})
