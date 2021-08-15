import { FastifyPluginAsync } from 'fastify'
import fastifyBlipp from 'fastify-blipp'

import prorateRoute from './prorate.route'

export const register: FastifyPluginAsync = async (app) => {
  app.register(fastifyBlipp)
  app.register(prorateRoute)
}

export default { register: register }
