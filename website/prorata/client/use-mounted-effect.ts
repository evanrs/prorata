import { useEffect, DependencyList } from 'react'

export function useMountedEffect(
  effect: (isMounted: () => boolean) => unknown | (() => void),
  dependencies?: DependencyList,
) {
  useEffect(() => {
    let mounted = true
    const destructor = effect(() => mounted)
    // TODO only return unmount when destructor not undefined?
    return () => {
      mounted = false
      if (typeof destructor === 'function') destructor()
    }
  }, dependencies)
}
