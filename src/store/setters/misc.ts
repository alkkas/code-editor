import { IEditorStore, ISymbol, IRange } from '../editorStore.types'
import { SetType, commonSetters } from './common'

export interface IMiscSetters {
  setFocus: (value: boolean) => void
  changeCurrentLine: (line: ISymbol[]) => void
  createNewLine: () => void
  copyToClipboard: (range: IRange) => void
  pasteText: (text: string) => void
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

        if (lines.length === 1) {
          state.currentCarriagePos.indexInLine += lines[0].length
        } else if (lines.length > 1) {
          state.currentCarriagePos.lineIndex += lines.length - 1
          state.currentCarriagePos.indexInLine = lines.at(-1)?.length ?? 0
        }
      })

      get().clearSelectionRange()
      get().highlightSyntax()
    },

    cut() {
      if (get().isSelectionActive()) {
        set((state) => {
          const range = get().getSelectionRange()

          const newLines = [...state.lines.slice(0, range.start.lineIndex)]

          newLines[range.start.lineIndex] = [
            ...state.lines[range.start.lineIndex].slice(
              0,
              range.start.indexInLine
            ),
          ]

          newLines[range.start.lineIndex] = [
            ...newLines[range.start.lineIndex],

            ...state.lines[range.finish.lineIndex].slice(
              range.finish.indexInLine + 1
            ),
          ]

          newLines.push(...state.lines.slice(range.finish.lineIndex + 1))

          state.lines = newLines

          state.currentCarriagePos.lineIndex = range.start.lineIndex
          state.currentCarriagePos.indexInLine = range.start.indexInLine
        })
        get().clearSelectionRange()
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
