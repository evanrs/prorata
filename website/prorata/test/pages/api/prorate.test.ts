import { AllocationRequest, AllocationResponse } from '../../../server'
import { handler, config } from '../../../pages/api/prorate'

import { data } from '../../data'
import { injectNextAPIHandler } from '../../tools'

// TODO or maybe not TO DO, that is the question
//      because testing next.js api routes, like real
//      blackbox testing is a real cruddy mess
//      … which is to say this doesn't work
xdescribe('Prorate Route', () => {
  it('allocates based on historical average', async () => {
    const [a, b, c, d] = data

    expect(await request(a.input)).toEqual(a.output)
    expect(await request(b.input)).toEqual(b.output)
    expect(await request(c.input)).toEqual(c.output)
    expect(await request(d.input)).toEqual(d.output)
  })
})

async function request(
  payload: AllocationRequest
): Promise<AllocationResponse> {
  const response = await injectNextAPIHandler<
    AllocationRequest,
    AllocationResponse
  >({ handler, config, payload })

  return response.payload
}
