import React, { useRef } from 'react'
import { Input, NumberInput } from '@chakra-ui/react'
import { useLayoutEffect } from '../client'

export type NumberProps = Parameters<typeof NumberInput>[0] & { type: 'number' }
export type InputProps = Parameters<typeof Input>[0] & { type?: string }
export type FieldProps = InputProps & {
  name: string | number
  value: string | number | null | undefined
  set?: Setter
  onChange?: void
}
export type Setter<K = string | number, V = string | number> = (name: K, value: V) => void

export const Field: React.FC<FieldProps> = ({ name, value, set, autoFocus, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  return (
    <Input
      ref={inputRef}
      variant="filled"
      fontSize={['xs', 'xs', 'sm', 'sm']}
      px={[2, 2, 2, 4]}
      {...props}
      name={name}
      value={value ?? ''}
      onChange={(e) => {
        set && set(name, e.currentTarget.value)
      }}
    />
  )
}
