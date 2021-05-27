import { DependencyList, EffectCallback, useCallback, useEffect, useReducer, useState } from 'react'

export function useGatedEffect(effect: EffectCallback, deps: DependencyList) {
  const [state, setState] = useState(false)

  useEffect(() => {
    if (state) {
      effect()
    }
  }, [state, ...deps])

  return useCallback((state?: boolean) => {
    setState((s) => (state == null ? !s : state))
  }, [])
}
