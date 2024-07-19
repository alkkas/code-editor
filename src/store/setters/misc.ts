import { IEditorStore, ISymbol, IRange } from '../editorStore.types'
import { SetType, commonSetters } from './common'

export interface IMiscSetters {
  setFocus: (value: boolean) => void
  changeCurrentLine: (line: ISymbol[]) => void
  createNewLine: () => void
  copyToClipboard: (range: IRange) => void
  pasteText: (text: string) => void
  changeSelectionRange: (range: Partial<IRange>) => void
  clearSelectionRange: () => void
  cut: () => void
}

export const getMiscSetters = (
  get: () => IEditorStore,
  set: SetType
): IMiscSetters => {
  return {
    setFocus: (value) =>
      set((state) => {
        state.isFocused = value
      }),

    changeCurrentLine(line) {
      set((state) => {
        state.lines[state.getCurrentLineIndex()] = line
      })
    },

    createNewLine() {
      set((state) => {
        const { index, indexInLine, line } = state.getCurrent()

        const oldLine = line.slice(0, indexInLine)
        const newLine = line.slice(indexInLine)

        state.lines = [
          ...state.lines.slice(0, index),
          oldLine,
          newLine,
          ...state.lines.slice(index + 1),
        ]

        state.currentCarriagePos.lineIndex++
        state.currentCarriagePos.indexInLine = 0
      })
    },

    copyToClipboard(range) {
      const text = get().getText(range)
      navigator.clipboard.writeText(text)
    },

    pasteText(text) {
      const lines = get().parseText(text)

      if (!lines.length) return

      set((state) => {
        let currentLine = state.getCurrentLine()

        currentLine = state.lines[state.currentCarriagePos.lineIndex] = [
          ...currentLine,
          ...lines[0],
        ]

        state.lines = [
          ...state.lines.slice(0, state.currentCarriagePos.lineIndex),
          currentLine,
          ...lines.slice(1),
          ...state.lines.slice(state.currentCarriagePos.lineIndex + 1),
        ]
      })
      get().highlightSyntax()
    },

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

    cut() {
      if (get().isSelectionActive()) {
        // selection
      } else {
        const { index, line } = get().getCurrent()

        get().copyToClipboard({
          start: { lineIndex: index, indexInLine: 0 },
          finish: { lineIndex: index, indexInLine: line.length },
        })

        set((state) => {
          if (state.lines.length !== 1) {
            commonSetters.deleteLine(index, state)
            state.currentCarriagePos.lineIndex--
          } else {
            state.lines = [[]]
          }

          state.currentCarriagePos.indexInLine = 0
        })
      }
    },
  }
}
