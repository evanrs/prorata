import React, { RefObject, useCallback, useEffect, useState } from 'react'
import { NumberInput, NumberInputField } from '@chakra-ui/react'
import { useDebounce } from 'use-debounce'
import currency from 'currency.js'

import { useLayoutEffect, useAutoFocus } from '../client'
import { FieldProps, fieldStyleProps } from './field'

type NumberProps = Parameters<typeof NumberInput>[0]

export const CurrencyField: React.FC<NumberProps & FieldProps> = (props) => {
  const { name, value, set, autoFocus, onChange: _, placeholder, ...rest } = props
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

  // Maintain caret position between updates
  const setCaret = useCaret(ref, formatted.length)
  const onChange = useCallback(
    (raw: string) => {
      // remove all non-numeric characters and format
      const next = format(raw.replace(/[^0-9]/g, ''))
      const diff = next.length - formatted.length > 1 ? 1 : 0
      const caret = ref.current?.selectionStart ?? 0
      // update only when value changes
      if (next !== formatted) {
        setCaret(caret + diff)
        setFormatted(next)
      }
    },
    [formatted],
  )
  // promote change on submission by enter
  const onEnter = ({ key }: React.KeyboardEvent<HTMLInputElement>) => key === 'Enter' && flush()

  return (
    <NumberInput
      inputMode="numeric"
      pattern="^[+-]?[$]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$"
      {...rest}
      name={name}
      value={formatted}
      onBlur={flush}
      onChange={onChange}
    >
      <NumberInputField
        {...fieldStyleProps}
        ref={ref}
        autoFocus={autoFocus}
        placeholder={placeholder}
        px={0}
        paddingInlineStart={fieldStyleProps.px}
        paddingInlineEnd={fieldStyleProps.px}
        onKeyDown={onEnter}
        // TODO use native onChange handler
        // onChange={(event) => {}}
      />
    </NumberInput>
  )
}

function format(raw: string | number | currency) {
  let [dollars, cents] = currency(raw).format({ pattern: '#' }).split('.')

  dollars =
    // TODO allow for zero values
    dollars == null || dollars === '' || currency(raw).value == 0
      ? ''
      : parse(dollars) != null
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

function useCaret(ref: RefObject<HTMLInputElement>, initialCaret = 0) {
  // Store the caret position
  const [caret, setCaret] = useState(initialCaret)

  // Maintain the caret position within the input on change
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.selectionStart = ref.current.selectionEnd = caret
    }
  }, [caret])

  return setCaret
}
