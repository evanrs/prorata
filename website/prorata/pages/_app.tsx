import 'ress/ress.css'
import '@fontsource/poppins/500.css'
import '@fontsource/ubuntu-mono/700.css'
import './app.css'

import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme, theme } from '@chakra-ui/react'

const extendedTheme = extendTheme({
  fonts: {
    heading: `Poppins, Inter, ${theme.fonts.heading}`,
    body: `Ubuntu Mono, Anonymous Pro, Inconsolata, Poppins, Nunito Sans, ${theme.fonts.body}`,
    // body: `Poppins, Nunito Sans, ${theme.fonts.body}`,
  },
  config: {
    useSystemColorMode: true,
  },
})

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={extendedTheme}>
      <Component {...pageProps} />{' '}
    </ChakraProvider>
  )
}

export default App
