import { WritableDraft } from '@/shared/utils/types/types'
import { IEditorStore } from '../editorStore.types'

//immer "produce" inside immer "produce" not working as expected
type ICommonSetters<T> = {
  [K in keyof T]: T[K] extends (...args: infer R) => unknown
    ? (...funcArg: [...R, state: any]) => void
    : never
}

export type CommonSettersObj = {
  deleteLine: (index: number) => void
}

type EditorStoreCommonSetters = ICommonSetters<CommonSettersObj>

export type SetType = (
  nextStateOrUpdater:
    | IEditorStore
    | Partial<IEditorStore>
    | ((state: WritableDraft<IEditorStore>) => void),
  shouldReplace?: boolean | undefined
) => void

export function mapCommonSetters(
  additionalSetters: EditorStoreCommonSetters,
  set: SetType
) {
  return Object.entries(additionalSetters).reduce((acc, [key, value]) => {
    //@ts-ignore
    acc[key] = (...args) => set((state) => value(...args, state))
    return acc
  }, {} as CommonSettersObj)
}

export const commonSetters: EditorStoreCommonSetters = {
  deleteLine: (index: number, state: WritableDraft<IEditorStore>) => {
    state.lines = [
      ...state.lines.slice(0, index),
      ...state.lines.slice(index + 1, state.lines.length),
    ]
  },
}
