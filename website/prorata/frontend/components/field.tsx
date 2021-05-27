import React from 'react'
import { Input } from '@chakra-ui/react'
import { useAutoFocus } from '..'

export type InputProps = Parameters<typeof Input>[0] & { type?: string }
export type FieldProps = {
  name: string | number
  value: string | number | null | undefined
  set?: Setter
  onChange?: void
}
export type Setter<K = string | number, V = string | number | undefined> = (
  name: K,
  value: V,
) => void

export const fieldStyleProps = {
  variant: 'filled',
  fontSize: ['xs', 'xs', 13, 'sm'],
  px: [2, 2, 2, 4],
}

export const Field: React.FC<InputProps & FieldProps> = (props) => {
  const { name, value, set, autoFocus, ...rest } = props
  return (
    <Input
      {...useAutoFocus(autoFocus)}
      {...fieldStyleProps}
      {...rest}
      name={name}
      value={value ?? ''}
      onChange={(e) => {
        set && set(name, e.currentTarget.value)
      }}
    />
  )
}
