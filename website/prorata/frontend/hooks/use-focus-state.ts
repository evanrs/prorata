import { useCallback, useState } from 'react'

export function useFocusState() {
  const [focused, setFocused] = useState(false)

  const onFocus = useCallback(() => setFocused(true), [])
  const onBlur = useCallback(() => setFocused(false), [])

  return [focused, { onFocus, onBlur }]
}
