import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { AllocationRequest, AllocationResponse } from '../shared'
import { fetch, useAsyncState } from '../client'
import { Prorata } from '../components'
import { Flex, Heading, useColorMode, useColorModeValue } from '@chakra-ui/react'

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

  return (
    <>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex
          direction="column"
          background={useColorModeValue('grey.100', 'grey.700')}
          p={8}
          rounded={8}
        >
          {/* <Heading size="lg">Prorata</Heading> */}
          <Prorata allocations={output?.allocations} allocationFor={setInput}></Prorata>
        </Flex>
      </Flex>
    </>
  )
}

export default Home
