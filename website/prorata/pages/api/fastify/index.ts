import Fastify, { FastifyPluginAsync } from 'fastify'
import fastifyBlipp from 'fastify-blipp'

const register: FastifyPluginAsync = async (app) => {
  app.register(fastifyBlipp)

  app.addHook('onRegister', (app) => {
    console.log('registration')
  })

  app.addHook('onRequest', (request) => {
    console.log('request.routerMethod, request.routerPath')
    console.log(request.routerMethod, request.routerPath)
    console.log('request.method, request.url')
    console.log(request.method, request.url)
  })

  app.get('/*', async () => {
    return { name: '*' }
  })
  app.get('/api', async () => {
    return { name: '/api' }
  })

  app.get('/api/fastify', async (request, reply) => {
    console.log("app.get '/api/fastify'")
    reply.send({ name: '/api/fastify' })
  })
}

// Instantiate Fastify with some config
const app = Fastify({
  logger: {
    prettyPrint: true,
  },
})

app.register(register)

export default async (req, res) => {
  console.log('received and waiting')
  await app.ready()
  console.log('emiting')
  app.server.emit('request', req, res)
}
