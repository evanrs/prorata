import 'ress/ress.css'
import '@fontsource/poppins/700.css'
import '@fontsource/ubuntu-mono/700.css'
import './app.css'

import { ChakraProvider, extendTheme, theme } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

const extendedTheme = extendTheme({
  fonts: {
    heading: `Poppins, ${theme.fonts.heading}`,
    body: `Ubuntu Mono, Poppins, ${theme.fonts.body}`,
  },
  config: {
    useSystemColorMode: true,
  },
})

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={extendedTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default App
