import React, { RefObject, useCallback, useEffect, useState } from 'react'
import { NumberInput, NumberInputField } from '@chakra-ui/react'
import currency from 'currency.js'

import { useLayoutEffect, useAutoFocus, useFocusState } from '../hooks'
import { FieldProps, fieldStyleProps } from './field'

type NumberProps = Parameters<typeof NumberInput>[0]

const ValidFormat = /^[+-]?[$]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$/
const HumanNumericEntry = /[$]$|(\d[,]\d{0,3}$)|(\.\d{0,1}$)/
const CommaRequired = /([,$]\d{4})$/

export const CurrencyField: React.FC<NumberProps & FieldProps> = (props) => {
  const { name, value, set, autoFocus, onChange: _, placeholder, ...rest } = props
  const { ref } = useAutoFocus(autoFocus)
  const [focused, focusProps] = useFocusState()

  // Store the formatted value
  const [formatted, setFormatted] = useState(() => {
    return value ? format(value) : ''
  })

  // Update ancestor with change
  useEffect(() => {
    if (set) {
      if (formatted === '') {
        return set(name)
      }

      const next = parse(formatted)
      if (next != null && next !== value) {
        return set(name, next)
      }

      if (!focused && value != null) {
        return setFormatted(format(value))
      }
    }
  }, [focused, formatted])

  // Maintain caret position between updates
  const setCaret = useCaret(ref, formatted.length)
  const onChange = useCallback(
    (raw: string) => {
      // remove all non-numeric characters and format
      const next = format(raw.replace(/[^0-9.]/g, ''))

      const caret = ref.current?.selectionStart ?? 0
      const diff = next.length - formatted.length
      // is the caret at the end of the string?
      const atEnd = caret === raw.length
      const nudge = atEnd ? next.length : diff + -Math.sign(diff) * 1

      setCaret(caret + nudge)
      // update only when value changes
      if (next !== formatted) {
        setFormatted(next)
      }
    },
    [formatted],
  )

  // Update the formatted value on prop change
  useEffect(() => {
    // ignore prop updates while typing
    if (focused) {
      return
    }
    // prepare value
    const prepared = value == null || value == '' ? '' : format(value)
    if (prepared !== formatted) {
      setFormatted(prepared)
    }
  }, [value])

  useEffect(() => {
    console.log('formatted change', formatted)
  }, [formatted])

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
        onKeyDown={(event) => {
          const key = event.key
          const value = event.currentTarget.value
          const next = value + key
          if (key === ',') {
            setFormatted(next)
          }
          if (key === '$' && !value) {
            setFormatted(key)
          }
        }}
        onChange={(event) => {
          const value = event.currentTarget.value

          // human numeric entry checks
          if (CommaRequired.test(value)) {
            setFormatted(`${value.slice(0, -1)},${value.slice(-1)}`)
          } else if (HumanNumericEntry.test(value)) {
            setFormatted(value)
          } else {
            // guess they're not human
            onChange(value)
          }
        }}
      />
    </NumberInput>
  )
}

function format(raw: string | number | currency) {
  let [dollars, cents] = currency(raw).format({ pattern: '#' }).split('.')
  console.log({ raw, dollars })
  dollars =
    // TODO allow for zero values
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
  } catch (e) {
    console.warn(e)
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

  return useCallback((caret: number) => {
    setState({ caret })
  }, [])
}

type Spyable = (...args: any) => any
type Spy<T extends Spyable> = (method: T, args: Parameters<T>) => ReturnType<T>
type SpyPipe<T extends Spyable> = (...args: Parameters<T>) => Spy<T>
type SpyFactory<T extends Spyable> = (method: T) => Spy<T>

function useSpy<T extends Spyable>(spy: Spy<T>): SpyFactory<T>
function useSpy<T extends Spyable>(spy: Spy<T>, method: T): SpyPipe<T>
function useSpy<T extends Spyable>(spy: Spy<T>, method?: T) {
  if (method == null) {
    return (method: T) => useSpy(spy, method)
  }

  const pipe: SpyPipe<T> = (...args: Parameters<T>) => {
    return spy(method, args)
  }

  return useCallback(pipe, [method])
}

function useLoggingSpy<T extends Spyable>(spyable: T, key?: string) {
  key = key || spyable.name || 'unknown'
  return useSpy((wrapped, args) => {
    console.log(wrapped, '(', ...args, ')')
    console.log(key, args)
    return wrapped(...args)
  }, spyable)
}
