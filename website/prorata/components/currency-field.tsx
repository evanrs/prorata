import React, { useEffect, useState } from 'react'
import { NumberInput, NumberInputField } from '@chakra-ui/react'
import { useDebounce } from 'use-debounce'
import currency from 'currency.js'

import { useAutoFocus } from '../client'
import { FieldProps, fieldStyleProps } from './field'

type NumberProps = Parameters<typeof NumberInput>[0]

export const CurrencyField: React.FC<NumberProps & FieldProps> = (props) => {
  const { name, value, set, autoFocus, ...rest } = props
  const [formatted, setFormatted] = useState(() => {
    return value ? format(value) : ''
  })
  useEffect(() => setFormatted(value ? format(value) : ''), [value])

  const [nextValue, { flush }] = useDebounce(parse(formatted) ?? value, 1000)
  useEffect(() => {
    if (set && value !== nextValue) {
      set(name, nextValue)
    }
  }, [nextValue])

  return (
    <NumberInput
      {...useAutoFocus(autoFocus)}
      {...rest}
      name={name}
      value={formatted}
      onBlur={flush}
      onChange={(raw: string) => setFormatted(format(raw))}
    >
      <NumberInputField {...fieldStyleProps} textAlign="right" />
    </NumberInput>
  )
}

function format(raw: string | number | currency) {
  let [dollars, cents] = currency(raw).format({ pattern: '#' }).split('.')

  dollars =
    !dollars || currency(dollars).value == 0
      ? ''
      : parse(dollars)
      ? currency(dollars).format().replace('.00', '')
      : `$${dollars}`
  cents = currency(cents, { fromCents: true }).value ? `.${cents.substr(0, 2)}` : ''

  return `${dollars}${cents}`
}

function parse(formatted: string) {
  try {
    return currency(formatted, { errorOnInvalid: true }).value
  } catch (e) {
    console.warn(e)
  }
}
