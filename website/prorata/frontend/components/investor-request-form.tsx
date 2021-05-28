import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Button, Grid } from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'

import { ajv, AllocationResponse, InvestorRequest } from '../../common'
import { Field, Setter } from './field'
import { CurrencyField } from './currency-field'
import { isNotEqual } from '../tools'

export type InvestorProps = {
  autoFocus?: boolean
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
  autoFocus,
}) => {
  const [state, setState] = useState<Partial<InvestorRequest> | undefined>(request)
  const [submitted, setSubmitted] = useState(request != null)
  const verified = useMemo(() => isInvestorRequest(state) && state, [state])

  const variant = name === 'new' ? 'outline' : 'filled'

  const setValue: Setter = useCallback((name, value) => {
    setState((state) => ({ ...state, [name]: value }))
  }, [])

  useEffect(() => {
    if (submitted && verified && isNotEqual(verified, request)) {
      // update when they're diffferent
      onUpdate(name, verified)
      // reset the form when done
      if (name === 'new') {
        setState({})
        setSubmitted(false)
      }
    } else if (name !== 'new' && submitted && !verified) {
      onUpdate(name, state as InvestorRequest)
    }
  }, [submitted, verified])

  return (
    <Grid
      as="form"
      autoComplete="off"
      my={2}
      gap={[1, 1, 2, 2]}
      templateColumns="1fr 1fr 1fr minmax(4.5rem, .75fr) 3rem"
      onSubmit={(event) => {
        event.preventDefault()

        if (isInvestorRequest(state)) {
          setSubmitted(true)
        }
      }}
    >
      <Field
        autoComplete="off"
        autoFocus={autoFocus}
        placeholder="Name"
        name="name"
        value={state?.name}
        set={setValue}
        variant={variant}
      />

      <CurrencyField
        placeholder="Requested Amount"
        name="requested_amount"
        value={state?.requested_amount}
        set={setValue}
        min={0}
        variant={variant}
      />

      <CurrencyField
        placeholder="Average Amount"
        name="average_amount"
        value={state?.average_amount}
        set={setValue}
        min={0}
        variant={variant}
      />

      <CurrencyField
        name="allocation"
        variant="outline"
        placeholder="Stake"
        readOnly
        value={allocation?.allocation ?? ''}
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

export const isInvestorRequest = ajv.compile<InvestorRequest>(InvestorRequest)
