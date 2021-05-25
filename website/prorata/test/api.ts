// test/server.js

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { allocate } from '../server'

import { AllocationRequest, AllocationResponse } from '../shared'

import { data } from './data'

const api = setupServer(
  rest.post<AllocationRequest, AllocationResponse>('*/api/prorate', (req, res, ctx) => {
    const result = data.find((sample) => {
      return req.body.allocation_amount === sample.request.allocation_amount
    })

    const response = result?.response ?? {
      allocations: allocate(req.body.investor_amounts, req.body.allocation_amount),
    }

    return res(ctx.json(response))
  }),

  rest.post('*/prorate', (_req, res, ctx) => {
    console.log({ route: '/prorate' })
    return res(ctx.json({ route: '/prorate' }))
  }),

  rest.post('*', (_req, res, ctx) => {
    console.log({ route: '*' })
    return res(ctx.json({ route: '*' }))
  }),
)

export { api, rest }
