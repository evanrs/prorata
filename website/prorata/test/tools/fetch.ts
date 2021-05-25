import fetchMock, { FetchMock, MockResponseInit } from 'jest-fetch-mock'

export type {
  MockParams,
  MockResponseInit,
  MockResponseInitFunction,
} from 'jest-fetch-mock'

export const fetch = fetchMock as unknown as fetch

export interface fetch extends Omit<FetchMock, 'mockResponse'> {
  mockResponse<T>(fn: TypedMockResponseInitFunction<T>): FetchMock
}

export interface TypedRequest<T> extends Request {
  json<P = T>(): Promise<P>
}

export type TypedMockResponseInitFunction<T> = (
  request: TypedRequest<T>
) => Promise<MockResponseInit | string>
