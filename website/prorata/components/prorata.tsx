import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Button, Flex, Grid, GridProps, Heading, Input, InputProps } from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'

import { EffectCallback } from 'react'
import { ajv, AllocationRequest, AllocationResponse, InvestorRequest } from '../shared'

const isAllocationRequest = ajv.compile<AllocationRequest>(AllocationRequest)
const isInvestorRequest = ajv.compile<InvestorRequest>(InvestorRequest)

export type Props = {
  allocation?: AllocationResponse
  allocationFor: (data: AllocationRequest) => ReturnType<EffectCallback>
}

export function Prorata({ allocation, allocationFor }: Props): JSX.Element {
  const [request, setRequest] = useState({
    allocation_amount: undefined,
    investor_amounts: [],
  } as Partial<AllocationRequest>)

  // TODO set request with values
  useEffect(() => {
    if (isAllocationRequest(request)) {
      allocationFor(request)
    }
  }, [request])

  const onUpdate: Setter<'new' | number, InvestorRequest> = useCallback((name, value) => {
    setRequest(({ allocation_amount, investor_amounts }) => {
      investor_amounts = [...(investor_amounts ?? [])]
      const index: number = name === 'new' ? investor_amounts.length : name

      investor_amounts[index] = value

      return { allocation_amount, investor_amounts }
    })
  }, [])

  return (
    <Flex direction="column">
      <Table>
        <Heading color="CaptionText" size="xs" fontWeight="black" pl={4}>
          Investor
        </Heading>
        <Heading color="CaptionText" size="xs" fontWeight="black" pl={4}>
          Request
        </Heading>
        <Heading color="CaptionText" size="xs" fontWeight="black" pl={4}>
          Average
        </Heading>
      </Table>
      {/* Allocation Amount: {request?.allocation_amount} */}
      {request?.investor_amounts?.map((investor, i) => (
        <Investor key={investor.name} request={investor} name={i} onUpdate={onUpdate} />
      ))}
      <Investor name="new" onUpdate={onUpdate} />
      {/* TODO fill ui with request values */}
      {/* TODO get new values from ui */}
    </Flex>
  )
}

type InvestorProps = {
  onUpdate: Setter<'new' | number, InvestorRequest>
  request?: InvestorRequest
} & ({ name: 'new' } | { request: InvestorRequest; name: number })

const Investor: React.FC<InvestorProps> = ({ name, request, onUpdate }) => {
  const [state, setState] = useState<Partial<InvestorRequest> | undefined>(request)
  const [submitted, setSubmitted] = useState(false)
  const verified = useMemo(() => isInvestorRequest(state) && state, [state])

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

  return (
    <Grid
      as="form"
      my=".5rem"
      gap={2}
      templateColumns="1fr 1fr 1fr 3rem"
      onSubmit={(event) => {
        event.preventDefault()

        if (isInvestorRequest(state)) {
          setSubmitted(true)
        }
      }}
    >
      <Field placeholder="Name" name="name" value={state?.name} set={setValue} />
      <Field
        placeholder="Requested Amount"
        name="requested_amount"
        value={state?.requested_amount}
        set={setValue}
        min={0}
        type="number"
      />
      <Field
        placeholder="Average Amount"
        name="average_amount"
        value={state?.average_amount}
        set={setValue}
        min={0}
        type="number"
      />

      {name === 'new' ? (
        <Button colorScheme="" variant="ghost" disabled>
          <AddIcon />
        </Button>
      ) : (
        <Button colorScheme="red" variant="ghost">
          <DeleteIcon />
        </Button>
      )}
      <input hidden type="submit" value="Submit" />
    </Grid>
  )
}

type Setter<K = string, V = string | number> = (name: K, value: V) => void
type FieldProps = InputProps & {
  name: string
  value: string | number | null | undefined
  set?: (name: string, value: string | number) => void
}

const Field: React.FC<FieldProps> = ({ name, value, set, onChange, ...props }) => {
  if (set) {
    onChange = (e) => set(name, e.currentTarget.value)
  }

  return <Input variant="filled" {...props} name={name} value={value ?? ''} onChange={onChange} />
}

const Table: React.FC<GridProps> = (props) => (
  <Grid {...props} my=".5rem" gap={2} templateColumns="1fr 1fr 1fr 3rem" />
)
