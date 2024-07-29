import { IEditorStore, IRange } from '../editorStore.types'
import { SetType } from './common'

export interface ISelectionSetters {
  changeSelectionRange: (range: Partial<IRange>) => void
  clearSelectionRange: () => void
}

export const getSelectionSetters = (
  get: () => IEditorStore,
  set: SetType
): ISelectionSetters => {
  return {
    changeSelectionRange(range) {
      set((state) => {
        if (range.start) {
          state.selectionRange.start = range.start
        }
        if (range.finish) {
          state.selectionRange.finish = range.finish
        }
      })
    },

    clearSelectionRange() {
      set((state) => {
        state.selectionRange = { start: undefined, finish: undefined }
      })
    },
  }
}
