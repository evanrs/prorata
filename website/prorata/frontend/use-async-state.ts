import { useEffect, useRef, useState, Dispatch, SetStateAction, DependencyList } from 'react'

import { isPromise } from './is-promise'
import { useMountedEffect } from './use-mounted-effect'

export function useAsyncState<S>(
  relay: (previous: S | undefined) => S | Promise<S | void>,
  dependencies: DependencyList,
  initialOutput?: S,
): [S | undefined, Dispatch<SetStateAction<S | undefined>>] {
  const [state, setState] = useState(initialOutput)
  const result = useRef(state)

  useMountedEffect((isMounted) => {
    const relayed = relay(state ?? result.current)

    return isPromise(relayed)
      ? relayed.then((resolved) => isMounted() && setState(resolved as S))
      : setState(relayed)
  }, dependencies)

  useEffect(() => {
    result.current = state
  }, [state])

  return [state ?? result.current, setState]
}
