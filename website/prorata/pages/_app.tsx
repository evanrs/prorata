import 'ress/ress.css'
// import '@fontsource/inter/latin.css'
import '@fontsource/inter/800.css'
import '@fontsource/nunito-sans/600.css'

import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme, theme } from '@chakra-ui/react'

const extendedTheme = extendTheme({
  fonts: {
    heading: `Inter, ${theme.fonts.heading}`,
    body: `Nunito Sans, ${theme.fonts.body}`,
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
