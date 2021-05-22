import { FastifyPluginAsync } from 'fastify'
import { allocate } from './allocate'
import { AllocationRequest, AllocationResponse } from './schema'

export const registerProrateRoute: FastifyPluginAsync = async (app) => {
  app.route<{
    Body: AllocationRequest
    Reply: AllocationResponse
  }>({
    method: 'POST',
    url: '/prorate',
    schema: {
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
