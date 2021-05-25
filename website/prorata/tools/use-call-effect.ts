import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
  DependencyList,
} from 'react'

export function useCallEffect<T>(
  producer: (produce: Dispatch<SetStateAction<T | undefined>>) => T,
  consumer: (product: T | undefined) => ReturnType<typeof useEffect>,
  dependencies: DependencyList
) {
  const [returnedValue, setReturnedValue] = useState<T>()

  useStateEffect(consumer, returnedValue)

  return useCallback(
    () => producer(setReturnedValue),
    [...dependencies, producer]
  )
}

export function useStateEffect<T = undefined>(
  effect: (state: T | undefined) => ReturnType<typeof useEffect>,
  state: T | undefined
) {
  return useEffect(() => effect(state), [state])
}
