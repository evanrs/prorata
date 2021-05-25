// import { enableFetchMocks } from 'jest-fetch-mock'
// import { AllocationRequest } from '../shared'

// import { data } from './data'
// import { createInjector, fetch } from './tools'
// enableFetchMocks()

// const inject = createInjector<AllocationRequest | undefined>({
//   method: 'POST',
//   path: '/prorate',
// })

// fetch.mockResponse<AllocationRequest>(async (request) => {
//   const input = await request.json()

//   const result = data.find((sample) => {
//     return input.allocation_amount === sample.request.allocation_amount
//   })

//   return {
//     body: JSON.stringify(result),
//     init: {
//       status: result ? 200 : 500,
//     },
//   }
// })

// // fetch.mockResponse<AllocationRequest>(async (request) => {
// //   const payload = await request.json()

// //   console.log('mockRequest', request.url, { payload })

// //   const { body, statusCode, statusMessage } = await inject({ payload })

// //   return {
// //     body,
// //     init: {
// //       url: '/api/prorate',
// //       status: statusCode,
// //       statusText: statusMessage,
// //     },
// //   }
// // })
