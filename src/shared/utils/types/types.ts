export type DeepPartial<T> =
  T extends Record<string, unknown>
    ? {
        [P in keyof T]?: DeepPartial<T[P]>
      }
    : T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TransformEventMap<T> = { [K in keyof T]: (evt: T[K]) => any }
