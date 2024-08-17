import { Draft } from 'immer'

export type DeepPartial<T> =
  T extends Record<string, unknown>
    ? {
        [P in keyof T]?: DeepPartial<T[P]>
      }
    : T

export type TransformEventMap<T> = { [K in keyof T]: (evt: T[K]) => void }

export type EventMap = Partial<TransformEventMap<HTMLElementEventMap>>

export type WritableDraft<T> = {
  -readonly [K in keyof T]: Draft<T[K]>
}
