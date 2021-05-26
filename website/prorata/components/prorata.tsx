import React, { useEffect, useState, useCallback, EffectCallback } from 'react'
import { Flex, Grid, GridProps, Heading } from '@chakra-ui/react'

import { Storage } from '../client'
import { ajv, AllocationRequest, AllocationResponse } from '../shared'

import { Field } from './field'
import { InvestorRequestForm, InvestorUpdateHandler } from './investor-request-form'

export type ProrataProps = {
  allocations?: AllocationResponse['allocations']
  allocationFor: (data?: AllocationRequest) => ReturnType<EffectCallback>
}

const isAllocationRequest = ajv.compile<AllocationRequest>(AllocationRequest)
const AllocationRequestStorage = Storage<AllocationRequest>('allocation-request')

export function Prorata({ allocations, allocationFor }: ProrataProps): JSX.Element {
  const [allocation_amount, setAllocationAmount] =
    useState<AllocationRequest['allocation_amount']>()
  const [investor_amounts, setInvestorAmounts] = useState<AllocationRequest['investor_amounts']>([])

  useEffect(() => {
    const request = AllocationRequestStorage.get('session')
    if (request) {
      setAllocationAmount(request?.allocation_amount)
      setInvestorAmounts(request?.investor_amounts ?? [])
    }
  }, [])

  useEffect(() => {
    const request = { allocation_amount, investor_amounts }
    AllocationRequestStorage.set('session', request)
    // if its empty reset the allocations
    if (investor_amounts.length === 0) {
      allocationFor()
    }
    // if its a valid request get the allocation
    else if (isAllocationRequest(request)) {
      allocationFor(request)
    }
  }, [allocation_amount, investor_amounts])

  const onInvestorUpdate: InvestorUpdateHandler = useCallback((name, value) => {
    setInvestorAmounts((investor_amounts) => {
      if (name === 'delete') {
        investor_amounts = investor_amounts.filter((v) => v !== value)
      } else {
        investor_amounts = [...investor_amounts]
        investor_amounts[name === 'new' ? investor_amounts.length : name] = value
      }

      return investor_amounts
    })
  }, [])

  return (
    <Flex direction="column">
      <Heading size="xs" fontWeight="black" mt={4}>
        Total Available Allocation
      </Heading>
      <Table>
        <Field
          placeholder="Allocation"
          name="allocation_amount"
          type="number"
          min={1}
          value={allocation_amount}
          set={(_, value) => {
            setAllocationAmount(Number(value))
          }}
        />
      </Table>
      {/*  investor request form headings */}
      <Table templateColumns="3fr minmax(4.5rem, .75fr) 3rem" my={0}>
        <Heading size="xs" fontWeight="black" mt={4}>
          Investor Breakdown
        </Heading>

        <Heading size="xs" fontWeight="black" mt={4} textAlign="left">
          Investor Stake
        </Heading>
      </Table>
      {/*  existing investor request forms */}
      {investor_amounts?.map((investor, i) => (
        <InvestorRequestForm
          key={`${investor.name}:${i}`}
          name={i}
          request={investor}
          allocation={allocations?.[i]}
          onUpdate={onInvestorUpdate}
        />
      ))}
      {/*  new investor request form */}
      <InvestorRequestForm name="new" onUpdate={onInvestorUpdate} />
    </Flex>
  )
}

const Table: React.FC<GridProps> = (props) => (
  <Grid my=".5rem" gap={2} templateColumns="1fr 1fr 1fr minmax(4.5rem, .75fr) 3rem" {...props} />
)
