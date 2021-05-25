import type { InjectOptions, InjectPayload, Response } from 'light-my-request'
import fastify, { FastifyPluginOptions, FastifyError } from 'fastify'
import * as app from '../../server'

type Options<T> = InjectOptions & { payload?: T }
type Inject<T> = (options: Options<T>) => Promise<Response>
type Injector<T> = Inject<T> & {
  snapshotFor: <R = Error>(payload?: T) => Promise<R>
}
type Error = FastifyError & {
  error: string
  message: string
  statusCode: number
}

export function createTestHarness<T = FastifyPluginOptions>(options?: T) {
  const harness = fastify({
    logger: { prettyPrint: true, level: 'fatal' },
  })

  return harness.register(app.register, options)
}

export function createInjector<T extends InjectPayload>(
  defaults: Options<T>
): Injector<T> {
  const harness = createTestHarness()

  const inject = async (options?: Options<T>) =>
    harness.inject({ ...defaults, ...options })

  const snapshotFor = async <R>(payload?: T) =>
    inject({ payload }).then((v) => v.json<R>())

  return Object.assign(inject, { snapshotFor })
}
