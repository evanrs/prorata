import { useState } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { Flex, useColorModeValue } from '@chakra-ui/react'

import { AllocationRequest, AllocationResponse } from '../shared'
import { fetch, useAsyncState } from '../frontend'
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

  return (
    <>
      <Head>
        <title>prorata</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex
          direction="column"
          background={useColorModeValue('grey.100', 'grey.700')}
          pl={[2, 4, 4, 6, 8]}
          pr={[1, 1, 2, 4, 4]}
          width="100%"
          maxWidth={['48rem', '48rem', '54rem', '58rem']}
          transitionProperty="max-width"
          transitionDuration="normal"
        >
          <Prorata allocations={output?.allocations} allocationFor={setInput}></Prorata>
        </Flex>
      </Flex>
    </>
  )
}

export default Home
