import Fastify, { FastifyPluginAsync, HTTPMethods } from 'fastify'
import { NextApiHandler } from 'next'
import { registerProrateRoute } from '../../server'

const app = Fastify({ logger: { prettyPrint: true } })
app.register(registerProrateRoute, { prefix: '/api/experiment' })

const handler: NextApiHandler = async (nextRequest, nextResponse) => {
  await app.ready()
  app.server.emit('request', nextRequest, nextResponse)
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

export { handler as default }
