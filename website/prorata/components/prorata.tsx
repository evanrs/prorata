import { useRouter } from 'next/router'

import { useEffect, useState } from 'react'
// TODO what leads UNDEFINED_VOID_ONLY: symbol to fail?
import { EffectCallback } from 'react'
import { data } from '../test/data'
import { AllocationRequest, AllocationResponse } from '../shared/schema'

export type Props = {
  allocation?: AllocationResponse
  allocationFor: (data: AllocationRequest) => ReturnType<EffectCallback>
}

export function Prorata({ allocation, allocationFor }: Props): JSX.Element {
  const [request, setRequest] = useState<AllocationRequest>(data[0].request)
  useEffect(() => allocationFor(request), [request])
  // TODO set request with values

  return (
    <div>
      {allocation?.allocations?.[0]?.name}
      {/* TODO fill ui with request values */}
      {/* TODO get new values from ui */}
    </div>
  )
}
