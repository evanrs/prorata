import React, { useEffect, useState, useCallback, EffectCallback } from 'react'
import { Flex, Grid, GridProps, Heading } from '@chakra-ui/react'
import { useDebounce } from 'use-debounce'

import { Storage } from '.'
import { ajv, AllocationRequest, AllocationResponse } from '../common'

import { CurrencyField, InvestorRequestForm, InvestorUpdateHandler } from './components'

export type ProrataProps = {
  allocations?: AllocationResponse['allocations']
  allocationFor: (data?: AllocationRequest) => ReturnType<EffectCallback>
}

const isAllocationRequest = ajv.compile<AllocationRequest>(AllocationRequest)
const AllocationRequestStorage = Storage<AllocationRequest>('allocation-request')

export function Prorata({ allocations, allocationFor }: ProrataProps): JSX.Element {
  const [ready, setReady] = useState(false)
  const [allocation_amount, setAllocationAmount] = useState<number>()
  const [investor_amounts, setInvestorAmounts] = useState<AllocationRequest['investor_amounts']>([])

  const [autoFocused, focused] = useDebounce(
    !ready ? null : !allocation_amount ? 'allocation' : 'investor-request-form',
    3000,
  )
  useEffect(focused.flush, [ready])

  useEffect(() => {
    setReady(true)

    const request = AllocationRequestStorage.get('session')
    if (request) {
      setAllocationAmount(request?.allocation_amount)
      setInvestorAmounts(request?.investor_amounts ?? [])
    }
    // if we unmount let's clear our session
    return () => AllocationRequestStorage.remove('session')
  }, [])

  useEffect(() => {
    if (ready) {
      const request = { allocation_amount, investor_amounts }
      // store current session
      AllocationRequestStorage.set('session', request)
      // if its empty reset the allocations
      if (allocations?.length && investor_amounts.length === 0) {
        allocationFor()
      }
      // if its a valid request get the allocation
      else if (isAllocationRequest(request)) {
        allocationFor(request)
      }
    }
  }, [ready, allocation_amount, investor_amounts])

  const onInvestorUpdate: InvestorUpdateHandler = useCallback((name, value) => {
    setInvestorAmounts((investor_amounts) => {
      if (name === 'delete') {
        investor_amounts = investor_amounts.filter((v) => v !== value)
      } else if (value) {
        const index = name === 'new' ? investor_amounts.length : name
        investor_amounts = [
          ...investor_amounts.slice(0, index),
          value,
          ...investor_amounts.slice(index + 1),
        ]
      }

      return investor_amounts
    })
  }, [])

  return (
    <Flex direction="column">
      <Table my={0}>
        <Heading size="xs" my={1}>
          Total Available Allocation
        </Heading>
        <div />
        <div />
        <Heading size="xs" my={1} opacity={allocations?.length ? 1 : 0}>
          Total Allocated
        </Heading>
      </Table>
      <Table>
        <CurrencyField
          autoFocus={autoFocused === 'allocation'}
          placeholder="Allocation"
          name="allocation_amount"
          min={1}
          variant={autoFocused === 'allocation' || !allocation_amount ? 'outline' : 'filled'}
          value={allocation_amount ? allocation_amount : ''}
          set={(_, value) => {
            setAllocationAmount(
              typeof value === 'number'
                ? value
                : typeof value === 'string'
                ? Number(value)
                : undefined,
            )
          }}
        />
        <div />
        <div />

        <CurrencyField
          name="total"
          variant="flushed"
          readOnly
          value={allocations?.reduce((a, b) => a + b.allocation, 0)}
          opacity={allocations?.length ? 1 : 0}
        />

        <div />
      </Table>

      {/*  investor request form headings */}
      <Table my={0} mt=".5rem">
        <Heading size="xs" mt={4} mb={1}>
          Investor Breakdown
        </Heading>
        <Heading size="xs" mt={4} mb={1}>
          {/* Requested */}
        </Heading>
        <Heading size="xs" mt={4} mb={1}>
          {/* Average */}
        </Heading>
        <Heading
          size="xs"
          mt={4}
          mb={1}
          textAlign="left"
          opacity={investor_amounts?.length ? 1 : 0}
        >
          Investor Stake
        </Heading>
        <div />
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
      <InvestorRequestForm
        // TODO drop the use of key here when handoff is complete
        key={`new:${investor_amounts.length}`}
        name="new"
        onUpdate={onInvestorUpdate}
        autoFocus={autoFocused === 'investor-request-form'}
      />
    </Flex>
  )
}

const Table: React.FC<GridProps> = (props) => (
  <Grid
    my={2}
    gap={[1, 1, 2, 2]}
    templateColumns="1fr 1fr 1fr minmax(4.5rem, .75fr) 3rem"
    alignItems="flex-end"
    {...props}
  />
)
