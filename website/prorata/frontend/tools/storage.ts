export function Storage<T>(prefix?: string) {
  const keyFor = (key?: string) => [prefix, key].filter(Boolean).join(':')
  return {
    get(key?: string): T | undefined {
      try {
        return JSON.parse(localStorage.getItem(keyFor(key)) ?? '') ?? undefined
      } catch (error) {
        // fail silently, because that happens sometimes
      }
    },

    set<V extends Partial<T>>(key: string, value: V): V {
      localStorage.setItem(keyFor(key), JSON.stringify(value))
      return value
    },

    clear(key: string) {
      localStorage.removeItem(keyFor(key))
    },
  }
}
