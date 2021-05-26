// export const identifies =
//   <T>(predicate: boolean | ((state: T | unknown) => boolean)) =>
//   (state: T | unknown): state is T =>
//     typeof predicate === 'function' ? predicate(state) : predicate

// export const identifier = <T>(predicate: boolean | ((state: T | unknown) => boolean)) => {
//   return (state: T | unknown): state is T =>
//     typeof predicate === 'function' ? predicate(state) : predicate
// }

export const identify = <T>(predicate: boolean | ((state: T | unknown) => boolean) = Boolean) => {
  return (state: T | unknown): state is T =>
    typeof predicate === 'function' ? predicate(state) : predicate
  // return (state: T | unknown): state is T => predicate(state)
}

// export function identifile<T>(predicate: boolean | ((state: T | unknown) => boolean)) {
//   return (state: T | unknown): state is T => {
//     return typeof predicate === 'function' ? predicate(state) : predicate
//   }
// }

// for mapping from strings to types
interface typeMap {
  string: string
  number: number
  boolean: boolean
  function: (...args: any[]) => any
}

// infer the guarded type from a specific case of PrimitiveOrConstructor
type GuardedType<T> = T extends { new (...args: any[]): infer U }
  ? U
  : T extends keyof typeMap
  ? typeMap[T]
  : never

// finally, guard ALL the types!
export function guard<T>(
  state: unknown,
  check?: boolean | ((o: unknown) => boolean),
): state is GuardedType<T> {
  if (typeof check === 'string') {
    return typeof state === check
  }
  if (typeof check !== 'function') {
    return Boolean(state)
  }

  return check(state)
}
type PrimitiveOrConstructor =
  | { new (...args: any[]): any }
  | keyof typeMap
  | ((state: ) => boolean)

// infer the guarded type from a specific case of PrimitiveOrConstructor
type GuardedType_<T extends PrimitiveOrConstructor> = T extends { new (...args: any[]): infer U }
  ? U
  : T extends keyof typeMap
  ? typeMap[T]
  : never

// finally, guard ALL the types!
export function typeGuard<T extends PrimitiveOrConstructor>(
  check: T,
  T | ,
): state is GuardedType_<T> {
  const localPrimitiveOrConstructor: PrimitiveOrConstructor = check
  if (typeof localPrimitiveOrConstructor === 'string') {
    return typeof state === localPrimitiveOrConstructor
  }
  // if (typeof localPrimitiveOrConstructor === 'function') {
  //   return check(state)
  // }
  if (typeof localPrimitiveOrConstructor !== 'function') {
    return Boolean(check)
  }

  // else if(typeof o )
  return state instanceof localPrimitiveOrConstructor
}
