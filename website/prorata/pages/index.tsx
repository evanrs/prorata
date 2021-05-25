import absoluteUrl from 'next-absolute-url'
import { fetch, useCallEffect } from '../tools'

import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Prorata, Props as ProrataProps } from '../components'
import { AllocationRequest, AllocationResponse } from '../shared'
import { data } from '../test/data'

export function Home(props) {
  // useCallEffect(
  //   (setState) => {
  //     setState(data[0].request)
  //   },
  //   (state) => {
  //     fetch<AllocationRequest, AllocationResponse>('/api/prorate', {

  //       method: 'POST',
  //       data: data[0].request,
  //     })
  //       .then((response) => setResult(response.data))
  //       .catch((e) => console.error(e))
  //   },
  //   []
  // )

  const router = useRouter()
  const [allocationRequest, setAllocationRequest] =
    useState<AllocationRequest>()

  const [allocation, setAllocation] = useState<AllocationResponse>()
  useEffect(() => {
    if (!allocationRequest) {
      return
    }

    let mounted = true

    fetch<AllocationRequest, AllocationResponse>(`/api/prorate`, {
      method: 'POST',
      data: data[0].request,
    })
      .then(
        (response) =>
          mounted &&
          setAllocation(response.data as unknown as AllocationResponse)
      )
      .catch((e) => console.error(e))

    return () => {
      mounted = false
    }
  }, [allocationRequest])

  const allocationFor = useCallback<ProrataProps['allocationFor']>((data) => {
    setAllocationRequest(data)
  }, [])

  return (
    <Prorata allocation={allocation} allocationFor={allocationFor}></Prorata>
  )
}

Home.getInitialProps = (context) => {
  console.log('getInitialProps', context)
  return { hello: true }
}

export default Home
