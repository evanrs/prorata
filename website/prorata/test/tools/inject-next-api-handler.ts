import { testApiHandler as inject } from 'next-test-api-route-handler'

import type { NextApiHandler, PageConfig } from 'next'

type TestAPIHandler<Payload> = {
  handler: NextApiHandler
  config: PageConfig
  payload: Payload
}

// TODO tbe dependency "next-test-api-route-handler" is really broken
//      as such this does not work one bit
export async function injectNextAPIHandler<RequestBody, ResponseBody>({
  handler,
  config,
  payload,
}: TestAPIHandler<RequestBody>): Promise<Response & { payload: ResponseBody }> {
  const response = await new Promise<Response>((resolve, reject) => {
    inject({
      handler: Object.assign(handler, config),
      test: async ({ fetch }) =>
        resolve(fetch({ method: 'POST', body: JSON.stringify(payload) })),
    })
  })

  return { ...response, payload: await response.json() }
}
