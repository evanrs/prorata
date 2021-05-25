import { Type } from '@sinclair/typebox'
import { FastifyPluginAsync } from 'fastify'
import { AllocationRequest, AllocationResponse } from '../shared/schema'
import { allocate } from './allocate'

export const registerProrateRoute: FastifyPluginAsync = async (app) => {
  app.route<{
    Body: AllocationRequest
    Reply: AllocationResponse
  }>({
    method: 'POST',
    url: '/prorate',
    schema: {
      headers: Type.Object({
        'content-type': Type.Literal('application/json'),
      }),
      body: AllocationRequest,
      response: { 200: AllocationResponse },
    },
    async handler(request, reply) {
      const allocations = allocate(
        request.body.investor_amounts,
        request.body.allocation_amount
      )
      reply.status(200).send({ allocations })
    },
  })
}

export default registerProrateRoute
