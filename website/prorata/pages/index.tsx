import { useState } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import absoluteUrl from 'next-absolute-url'

import { AllocationRequest, AllocationResponse } from '../shared'
import { fetch, useAsyncState } from '../client'
import { Prorata } from '../components'

export type HomeProps = Record<string, unknown>

export const Home: NextPage<HomeProps> = (_props) => {
  const [input, setInput] = useState<AllocationRequest>()
  const [output] = useAsyncState<AllocationResponse>(() => {
    if (input == null) {
      return { allocations: [] }
    }

    return fetch<AllocationRequest, AllocationResponse>('/api/prorate', {
      method: 'POST',
      data: input,
    })
      .then((response) => response.data)
      .catch((e) => console.error(e))
  }, [input])

  return <Prorata allocation={output} allocationFor={setInput}></Prorata>
}

Home.getInitialProps = async (context) => {
  console.log('getInitialProps', context)
  return { hello: true }
}

export default Home
