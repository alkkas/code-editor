import { IEditorStore, ISymbol } from '../editorStore.types'
import { SetType } from './common'

export interface ISymbolSetters {
  addNewSymbol: (...newSymbols: ISymbol[]) => void
  deleteSymbol: () => void
}

export const getSymbolSetters = (
  get: () => IEditorStore,
  set: SetType
): ISymbolSetters => {
  return {
    addNewSymbol(...newSymbols) {
      newSymbols.forEach((symbol) => {
        const { indexInLine, line } = get().getCurrent()

        get().changeCurrentLine([
          ...line.slice(0, indexInLine),
          symbol,
          ...line.slice(indexInLine),
        ])

        set((state) => {
          state.currentCarriagePos.indexInLine++
        })
      })

      get().clearSelectionRange()
    },

    deleteSymbol() {
      if (get().isSelectionActive()) {
        get().removeSelectedText()
        return
      }

      const { indexInLine, line, index } = get().getCurrent()

      if (indexInLine === 0) {
        if (index === 0) return

        set((state) => {
          state.lines = [
            ...state.lines.slice(0, index),
            ...state.lines.slice(index + 1),
          ]

          state.lines[index - 1] = [...state.lines[index - 1], ...line]

          state.currentCarriagePos.indexInLine =
            state.lines[index - 1].length - line.length
          state.currentCarriagePos.lineIndex = index - 1
        })

        return
      }

      get().changeCurrentLine([
        ...line.slice(0, indexInLine - 1),
        ...line.slice(indexInLine),
      ])

      set((state) => {
        state.currentCarriagePos.indexInLine--
      })
    },
  }
}
