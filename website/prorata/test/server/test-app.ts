import fastify from 'fastify'
import * as app from '../../backend'

// config needed for testing the application
const defaults = {
  app: {
    logger: { prettyPrint: true, level: 'warn' },
  },
}

// automatically build and tear down our instance
export function create(options: Partial<typeof defaults> = {}) {
  const config = { ...defaults, ...options }
  const harness = fastify(config.app)

  harness.register(app.register, config)

  return harness
}
