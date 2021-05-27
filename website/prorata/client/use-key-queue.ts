import { useState } from 'react'

type UseKeyQueue<T> = [queue: T[], onKey: (event: { key: string }) => void, clear: () => void]

export function useKeyQueue<T extends string>(
  filter: (key: string) => boolean = Boolean,
): UseKeyQueue<T> {
  const [queue, setQueue] = useState<T[]>([])

  const onKey = ({ key }: { key: T | string }) => {
    if (filter(key)) {
      setQueue((q) => q.concat(key as T))
    }
  }

  const clear = () => {
    setQueue((queue) => (queue.length ? [] : queue))
  }

  return [queue, onKey, clear]
}
