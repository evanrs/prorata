import { useState } from 'react'
import { useColorModeValue, Flex } from '@chakra-ui/react'
import { NextPage } from 'next'
import Head from 'next/head'

import { AllocationRequest, AllocationResponse } from '../common'
import { fetch, useAsyncState, Prorata, Supervisor } from '../frontend'

export type HomeProps = Record<string, unknown>

export const Home: NextPage<HomeProps> = (_) => {
  // used to reset our app by updating the key of the component
  const [instanceKey, setInstanceKey] = useState(0)

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

      {/* a few tools to control things */}
      <Supervisor reset={() => setInstanceKey((v) => v + 1)} />

      {/* the root layout */}
      <Layout>
        {/* the star of the show */}
        <Prorata
          key={instanceKey}
          allocations={output?.allocations}
          allocationFor={setInput}
        ></Prorata>
      </Layout>
    </>
  )
}

const Layout: React.FC = ({ children }) => (
  <Flex
    height="100%"
    width="100%"
    alignItems="center"
    justifyContent="center"
    background={useColorModeValue('#FFF', 'gray.800')}
    sx={safeAreaInsetPadding}
  >
    <Flex
      direction="column"
      pl={[2, 4, 4, 6, 8]}
      pr={[1, 1, 2, 4, 4]}
      width="100%"
      maxWidth={['48rem', '48rem', '54rem', '58rem']}
      transitionProperty="max-width"
      transitionDuration="normal"
    >
      {children}
    </Flex>
  </Flex>
)

const safeAreaInsetPadding = {
  pl: 'env(safe-area-inset-left)',
  pr: 'env(safe-area-inset-right)',
  pt: 'env(safe-area-inset-top)',
  pb: 'env(safe-area-inset-bottom)',
}

export default Home
