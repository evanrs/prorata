import React, { useEffect, useState, useCallback, useMemo, useRef, useLayoutEffect } from 'react'
import { Button, Grid } from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'

import { ajv, AllocationResponse, InvestorRequest } from '../shared'
import { Field, Setter } from './field'

export const isInvestorRequest = ajv.compile<InvestorRequest>(InvestorRequest)

export type InvestorProps = {
  request?: InvestorRequest
  allocation?: AllocationResponse['allocations'][number]
  onUpdate: InvestorUpdateHandler
} & ({ name: 'new' } | { request: InvestorRequest; name: number })

export type InvestorUpdateHandler = Setter<'new' | 'delete' | number, InvestorRequest>

export const InvestorRequestForm: React.FC<InvestorProps> = ({
  name,
  request,
  allocation,
  onUpdate,
}) => {
  const [state, setState] = useState<Partial<InvestorRequest> | undefined>(request)
  const [submitted, setSubmitted] = useState(request != null)
  const verified = useMemo(() => isInvestorRequest(state) && state, [state])

  const inputRef = useRef<HTMLInputElement>(null)
  const variant = name === 'new' ? 'outline' : 'filled'

  const setValue: Setter = useCallback((name, value) => {
    setState((state) => ({ ...state, [name]: value }))
  }, [])

  useEffect(() => {
    if (submitted && verified) {
      onUpdate(name, verified)
      if (name === 'new') {
        setSubmitted(false)
        setState({})
      }
    }
  }, [submitted, verified])

  useLayoutEffect(() => {
    if (name === 'new') {
      console.log('meeeee', name, inputRef.current)
      inputRef.current?.focus()
    }
  }, [name, submitted])

  return (
    <Grid
      as="form"
      my=".5rem"
      gap={2}
      templateColumns="1fr 1fr 1fr minmax(4.5rem, .75fr) 3rem"
      onSubmit={(event) => {
        event.preventDefault()

        if (isInvestorRequest(state)) {
          setSubmitted(true)
        }
      }}
    >
      <Field
        ref={inputRef}
        placeholder="Name"
        name="name"
        value={state?.name}
        set={setValue}
        variant={variant}
      />

      <Field
        placeholder="Requested Amount"
        name="requested_amount"
        value={state?.requested_amount}
        set={setValue}
        min={0}
        type="number"
        variant={variant}
      />

      <Field
        placeholder="Average Amount"
        name="average_amount"
        value={state?.average_amount}
        set={setValue}
        min={0}
        type="number"
        variant={variant}
      />

      <Field
        name="allocation"
        variant="outline"
        placeholder="Stake"
        readOnly
        value={allocation?.allocation ?? ''}
        textAlign="right"
        display={name === 'new' ? 'none' : 'initial'}
      />

      {request == null ? (
        <Button colorScheme="messenger" type="submit" variant="solid" disabled={!verified}>
          <AddIcon fontSize={14} />
        </Button>
      ) : (
        <Button colorScheme="red" variant="ghost" onClick={() => onUpdate('delete', request)}>
          <DeleteIcon />
        </Button>
      )}

      <input hidden type="submit" value="Submit" />
    </Grid>
  )
}
