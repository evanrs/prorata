// test/server.js

import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { AllocationRequest, AllocationResponse } from '../shared'

import { data } from './data'

const api = setupServer(
  rest.post<AllocationRequest, AllocationResponse>(
    '*/api/prorate',
    (req, res, ctx) => {
      const result = data.find((sample) => {
        return req.body.allocation_amount === sample.request.allocation_amount
      })

      return res(ctx.json(result.response))
    }
  ),
  rest.post('*/prorate', (req, res, ctx) => {
    return res(ctx.json({ what: '/prorate' }))
  }),
  rest.post('*', (req, res, ctx) => {
    return res(ctx.json({ what: "('" }))
  })
)

export { api, rest }
