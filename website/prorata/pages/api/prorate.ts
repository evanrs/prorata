// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiHandler } from 'next'
import { Type, Static } from '@sinclair/typebox'
import { allocate, AllocationRequest, AllocationResponse } from '../../server'

import FastestValidator from 'fastest-validator'

const fv = new FastestValidator({})

// const checkAllocationRequest = fv.compile(AllocationRequest)
const checkAllocationRequest = (whatever: any) => true
// const checkAllocationResponse = fv.compile(AllocationResponse)

export type RequestBody = AllocationRequest
export type ResponseBody = AllocationResponse

export const config = {}
export const handler: NextApiHandler = async (req, res) => {
  console.log(req.body)
  switch (req.method) {
    case 'POST':
      // await checkAllocationRequest(JSON.parse(req.body))
      // allocate(req.body)
      break
  }

  res.status(200).json({ name: 'api/prorate.ts' })
}

export default handler
