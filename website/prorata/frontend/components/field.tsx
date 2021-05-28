import React, { useEffect, useState } from 'react'
import { Input } from '@chakra-ui/react'
import { useDebounce } from 'use-debounce'

import { useAutoFocus } from '../hooks'

export type InputProps = Parameters<typeof Input>[0] & { type?: string }
export type FieldProps = {
  name: string | number
  value: string | number | null | undefined
  set?: Setter
  onChange?: void
}
export type Setter<K = string | number, V = string | number | undefined> = (
  name: K,
  value?: V,
) => void

export const fieldStyleProps = {
  variant: 'filled',
  fontSize: ['xs', 'xs', 13, 'sm'],
  px: [2, 2, 2, 4],
}

export const Field: React.FC<InputProps & FieldProps> = (props) => {
  const { name, value, set, autoFocus, ...rest } = props
  const [local, setLocal] = useState(value ?? '')

  const [delayedLocal, delay] = useDebounce(local, 600)
  useEffect(() => {
    set && set(name, local)
  }, [delayedLocal])

  return (
    <Input
      {...useAutoFocus(autoFocus)}
      {...fieldStyleProps}
      {...rest}
      onBlur={delay.flush}
      name={name}
      value={local}
      onChange={(e) => setLocal(e.currentTarget.value)}
    />
  )
}
