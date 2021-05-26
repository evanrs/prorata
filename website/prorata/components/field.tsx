import React from 'react'
import { Input, NumberInput } from '@chakra-ui/react'

export type Setter<K = string, V = string | number> = (name: K, value: V) => void
export type NumberProps = Parameters<typeof NumberInput>[0] & { type: 'number' }
export type InputProps = Parameters<typeof Input>[0] & { type?: string }
export type FieldProps = InputProps & {
  name: string | number
  value: string | number | null | undefined
  set?: (name: string, value: string | number) => void
}

export const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ name, value, set, onChange, ...props }, ref) => {
    if (set) {
      onChange = (e) => set(name, e.currentTarget.value)
    }

    return (
      <Input
        ref={ref}
        variant="filled"
        fontSize={['xs', 'xs', 'sm', 'md']}
        px={[2, 2, 2, 4]}
        {...props}
        name={name}
        value={value ?? ''}
        onChange={onChange}
      />
    )
  },
)
