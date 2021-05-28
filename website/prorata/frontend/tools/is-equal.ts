export function isEqual<T extends Record<string, unknown>>(
  reference?: T,
  partial?: Partial<T>,
): partial is T {
  if (!reference || !partial) {
    return false
  }

  return Object.keys(reference).every((k) => reference[k] === partial[k])
}

export function isNotEqual<T extends Record<string, unknown>>(reference?: T, partial?: Partial<T>) {
  return !isEqual(reference, partial)
}
