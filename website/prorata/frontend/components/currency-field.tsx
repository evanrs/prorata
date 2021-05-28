import React, { RefObject, useCallback, useEffect, useState } from 'react'
import { NumberInput, NumberInputField } from '@chakra-ui/react'
import currency from 'currency.js'

import { useLayoutEffect, useAutoFocus, useFocusState } from '../hooks'
import { FieldProps, fieldStyleProps } from './field'

type NumberProps = Parameters<typeof NumberInput>[0]

const ValidFormat = /^[+-]?[$]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$/
const HumanNumericEntry = /[$]$|(\d[,]\d{0,3}$)|(\.\d{0,1}$)/
const CommaRequired = /([,$]\d{4})$/
const InvalidStrings = /([e-])|([,.][,.]+)/g

export const CurrencyField: React.FC<NumberProps & FieldProps> = (props) => {
  const { name, value, set, autoFocus, onChange: _, placeholder, ...rest } = props
  const { ref } = useAutoFocus(autoFocus)

  // Store the formatted value
  const [formatted, setFormatted] = useState(() => {
    return value ? format(value) : ''
  })

  // Update the formatted value on prop change
  useEffect(() => {
    // only update when they're not using the input
    if (!focused)
      // format the value and update
      setFormatted(value == null || value == '' ? '' : format(value))
  }, [value])

  // Provide focus state for effects to infer intent
  const [focused, focusProps] = useFocusState({
    // Update when done, accept input as implicitly correct if valid
    onBlur: useCallback((event) => {
      const text = format(event.currentTarget?.value.replace(InvalidStrings, ''))
      if (isNumber(text)) setFormatted(text)
    }, []),
  })

  // Update ancestor with change
  useEffect(() => {
    if (set) {
      // clear the value when empty
      // TODO … and where did it get emptied
      if (formatted === '' && value !== 0) return set(name)
      // check that we can parse their input, then update
      const next = parse(formatted)
      if (next != null && next !== value) {
        return set(name, next)
      }
      // reset the input to the prop value when not parsed
      if (!focused && value != null) {
        return setFormatted(format(value))
      }
    }
  }, [focused, formatted])

  // Maintain caret position between updates
  const setCaret = useCaret(ref, formatted.length)
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value

      // human numeric entry checks
      if (CommaRequired.test(value)) {
        return setFormatted(`${value.slice(0, -1)},${value.slice(-1)}`)
      } else if (HumanNumericEntry.test(value)) {
        return setFormatted(value.replace(InvalidStrings, ''))
      }
      // guess they're not human … let's get formatting
      // remove all non-numeric characters and format
      const next = format(value.replace(/[^0-9.]/g, ''))

      const caret = ref.current?.selectionStart ?? 0
      const diff = next.length - formatted.length
      // is the caret at the end of the string?
      const atEnd = caret === value.length
      const nudge = atEnd ? next.length : diff + -Math.sign(diff) * 1
      // always maintain caret position
      setCaret(caret + (isNumber(next) ? nudge : -1))
      // update only when the value has changed
      if (next !== formatted && isNumber(next)) setFormatted(next)
    },
    [formatted],
  )
  // permit the input of natural numeric delimiters
  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    const caret = ref.current?.selectionStart ?? 0
    const key = event.key
    if (key === ',' && value.slice(-1) !== ',' && value.length === caret) setFormatted(value + key)
    if (key === '$' && !value) setFormatted(key)
  }, [])

  return (
    <NumberInput
      inputMode="numeric"
      pattern={ValidFormat.source}
      {...rest}
      name={name}
      value={formatted}
    >
      <NumberInputField
        inputMode="numeric"
        {...fieldStyleProps}
        {...focusProps}
        ref={ref}
        autoFocus={autoFocus}
        placeholder={placeholder}
        px={0}
        paddingInlineStart={fieldStyleProps.px}
        paddingInlineEnd={fieldStyleProps.px}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </NumberInput>
  )
}

function format(raw: string | number | currency) {
  let [dollars, cents] = currency(raw).format({ pattern: '#' }).split('.')

  dollars =
    dollars == null || dollars === '' || raw === ''
      ? ''
      : !parse(dollars) // if not falsey, not nullish or zero
      ? currency(dollars).format().replace('.00', '')
      : `$${dollars}`

  cents = currency(cents, { fromCents: true }).value ? `.${cents.substr(0, 2)}` : ''

  return `${dollars}${cents}`
}

function parse(formatted: string) {
  if (!ValidFormat.test(formatted)) return
  try {
    return currency(formatted, { errorOnInvalid: true }).value
  } catch (_) {
    // empty block
  }
}

function useCaret(ref: RefObject<HTMLInputElement>, initialCaret = 0) {
  // Store the caret position
  const [state, setState] = useState({ caret: initialCaret })
  // Maintain the caret position within the input on change
  useLayoutEffect(() => {
    if (state.caret != null && ref.current) {
      ref.current.selectionStart = ref.current.selectionEnd = state.caret
    }
  }, [state])
  // induce layout effect by using non referentially equal values
  return useCallback((caret: number) => setState({ caret }), [])
}

function isNumber(value: currency.Any): value is number | string {
  return Number.isNaN(currency(value).value) === false
}
