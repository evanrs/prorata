import Fastify from 'fastify'
import { NextApiHandler } from 'next'
import { registerProrateRoute } from '../../backend'

const app = Fastify({ logger: { prettyPrint: true } })
app.register(registerProrateRoute, { prefix: '/api' })

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
