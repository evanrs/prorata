import { fetch, TypedResponse } from '@evanrs/fetch'

export interface ExtendedRequestInit<T> extends RequestInit {
  data?: T
}

export interface ExtendedResponse<T> extends TypedResponse<T> {
  data: T
}

async function __fetch<D, T>(
  request: RequestInfo,
  { data, headers, body, ...options }: ExtendedRequestInit<D> = {},
): Promise<ExtendedResponse<T>> {
  if (data != null) {
    headers = { ...headers, 'content-type': 'application/json' }
    body = JSON.stringify(data)
  }

  const response = await fetch<T>(
    `${process.env.API_BASE_URL ?? ''}${(request as Request)?.url ?? request}`,
    {
      ...options,
      headers,
      body,
    },
  )

  return Object.assign(response, {
    data: await response.json(),
  })
}

function isRequest(request: RequestInfo): request is Request {
  return String(request) === '[object Request]'
}

export { __fetch as fetch }
