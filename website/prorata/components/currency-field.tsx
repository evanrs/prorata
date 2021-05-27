import React, { useEffect, useState } from 'react'
import { NumberInput, NumberInputField } from '@chakra-ui/react'
import { useDebounce } from 'use-debounce'
import currency from 'currency.js'

import { useLayoutEffect, useAutoFocus } from '../client'
import { FieldProps, fieldStyleProps } from './field'

type NumberProps = Parameters<typeof NumberInput>[0]

export const CurrencyField: React.FC<NumberProps & FieldProps> = (props) => {
  const { name, value, set, autoFocus, ...rest } = props
  const { ref } = useAutoFocus(autoFocus)

  // Store the formatted value
  const [formatted, setFormatted] = useState(() => {
    return value ? format(value) : ''
  })
  // Update the formatted value on prop change
  useEffect(() => {
    setFormatted(value ? format(value) : '')
  }, [value])

  // Debounce change events to not disrupt typing
  const [nextValue, { flush }] = useDebounce(parse(formatted) ?? value, 300)
  // Update ancestor with change
  useEffect(() => {
    if (set && value !== nextValue) {
      set(name, nextValue)
    }
  }, [nextValue])

  // Store the caret position
  const [caret, setCaret] = useState(formatted.length)
  // Maintain the caret position within the input on change
  useLayoutEffect(() => {
    if (ref.current) {
      console.log('layout', { caret })
      ref.current.selectionStart = ref.current.selectionEnd = caret
    }
  }, [caret])

  return (
    <NumberInput
      inputMode="numeric"
      {...rest}
      name={name}
      value={formatted}
      onBlur={flush}
      // onKeyPress={({ key }: { key: string }) => {
      //   if (key === ',' || key === '.') {
      //     setFormatted((f) => f + key)
      //   }
      // }}
      onChange={(raw: string) => {
        // remove all non-numeric characters
        raw = raw.replace(/[^0-9]/g, '')

        const next = format(raw)
        const caret = ref.current?.selectionStart ?? 0
        const diff = next.length - formatted.length > 1 ? 1 : 0

        if (next !== formatted) {
          setCaret(caret + diff)
          setFormatted(next)
        }
      }}
    >
      <NumberInputField ref={ref} autoFocus={autoFocus} {...fieldStyleProps} textAlign="right" />
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
