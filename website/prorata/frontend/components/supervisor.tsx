import {
  Flex,
  Button,
  Grid,
  Heading,
  useColorMode,
  SystemStyleObject,
  useColorModeValue,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon, RepeatIcon, ChatIcon, SmallCloseIcon } from '@chakra-ui/icons'
import { useState } from 'react'

const mailto = `mailto:me@evanrs.com?subject=${encodeURIComponent(
  'Evan, nice work on Prorata 👏',
)}&body=${encodeURIComponent('Hey Evan,\n\nI just wanted say …')}&cc=evanrs@gmail.com`

export type SupervisorProps = {
  repeat?: () => void
  reset?: () => void
}

export const Supervisor = ({ repeat, reset }: SupervisorProps) => {
  const [hover, setHover] = useState(true)
  const { colorMode, toggleColorMode } = useColorMode()

  const sx: SystemStyleObject = {
    willChange: 'color',
    transitionProperty: 'color',
    transitionDuration: 'normal',
  }
  const top = useColorModeValue(
    { color: 'gray.400', ':hover': { color: 'gray.400' } },
    { color: 'gray.600', ':hover': { color: 'gray.500' } },
  )
  const bottom = useColorModeValue(
    { color: hover ? 'pink.400' : 'gray.200', ':hover': { color: 'gray.600' } },
    { color: hover ? 'pink.200' : 'gray.700', ':hover': { color: 'gray.200' } },
  )

  const props = {
    variant: 'ghost',
    py: 0,
    px: 0,
    width: '3rem',
    height: '2.5rem',
    color: 'unset',
  }

  const onHover = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  }

  return (
    <>
      <Layout position="top" {...onHover} sx={{ ...sx, ...top }}>
        <Heading size="md">prorata</Heading>
        <Grid width="max-content" templateColumns="repeat(3, min-content)" gap={[1, 1, 2, 2]}>
          <Button {...props} as="a" href={mailto}>
            <ChatIcon />
            {/* <Flex px={2} />
            <Heading size="xs">Evan Schneider</Heading> */}
          </Button>
          <Button {...props} onClick={toggleColorMode}>
            {colorMode === 'dark' ? <SunIcon boxSize={5} /> : <MoonIcon boxSize={4} />}
          </Button>

          {repeat != null && (
            <Button {...props} onClick={repeat}>
              <RepeatIcon />
            </Button>
          )}
          {reset != null && (
            <Button {...props} onClick={reset}>
              <SmallCloseIcon boxSize={6} />
            </Button>
          )}
        </Grid>
      </Layout>
      <Layout position="bottom" justifyContent="flex-end" {...onHover} sx={{ ...sx, ...bottom }}>
        <Button
          color=""
          variant="ghost"
          width="max-content"
          py={2}
          px={4}
          as="a"
          href={mailto}
          size="lg"
          sx={{
            ':not(:hover)': {
              transition: 'all',
              transitionDuration: hover ? '1s' : '2.5s',
              transitionTimingFunction: hover ? 'ease-out' : 'ease',
            },
            '.surprise': { opacity: 0, transition: 'all 2.5s ease-in-out' },
            ':hover': { '.surprise': { opacity: 1, transition: 'all 200ms ease' } },
          }}
        >
          <ChatIcon className="surprise" />
          <Flex pr={3} />
          <Heading size="sm">Evan Schneider</Heading>
        </Button>
      </Layout>
    </>
  )
}

type LayoutProps = Omit<Parameters<typeof Flex>[0], 'position'> & {
  position: 'top' | 'bottom'
}

const Layout: React.FC<LayoutProps> = ({ children, position, ...props }) => {
  props[position] = 3

  return (
    <Flex
      cursor="default"
      userSelect="none"
      position="fixed"
      left={[2, 4, 4, 6, 8]}
      right={[2, 4, 4, 6, 8]}
      alignItems="center"
      justifyContent="space-between"
      {...props}
    >
      {children}
    </Flex>
  )
}
