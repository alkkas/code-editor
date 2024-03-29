import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {
  IEditorStore,
  ISymbol,
} from '@/entities/editor-store/editorStore.types'

export const useEditorStore = create(
  immer<IEditorStore>((set, get) => ({
    currentCarriagePos: { line: 0, indexInLine: 0 },
    isFocused: false,
    lines: [[]],
    selectionRange: { start: undefined, finish: undefined },

    // setters
    setFocus: (value) =>
      set((state) => {
        state.isFocused = value
      }),

    setCarriagePos(pos) {
      set((state) => {
        if (pos.line !== undefined) {
          state.currentCarriagePos.line = pos.line
        }
        if (pos.indexInLine !== undefined) {
          state.currentCarriagePos.indexInLine = pos.indexInLine
        }
      })
    },

    changeCurrentLine(line) {
      set((state) => {
        state.lines[state.getCurrentLineIndex()] = line
      })
    },

    addNewSymbol(newSymbol) {
      const { indexInLine, line } = get().getCurrent()

      get().changeCurrentLine([
        ...line.slice(0, indexInLine),
        newSymbol,
        ...line.slice(indexInLine),
      ])

      set((state) => {
        state.currentCarriagePos.indexInLine++
      })
    },

    deleteSymbol() {
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
          state.currentCarriagePos.line = index - 1
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

        state.currentCarriagePos.line++
        state.currentCarriagePos.indexInLine = 0
      })
    },

    moveCarriage: (direction) => {
      set((state) => {
        const moveCarriageToClosestSymbol = (line: ISymbol[]) => {
          if (line.length < state.currentCarriagePos.indexInLine) {
            state.currentCarriagePos.indexInLine = line.length
          }
        }

        const { index, indexInLine, line } = state.getCurrent()

        switch (direction) {
          case 'down':
            if (state.lines[index + 1]) {
              state.currentCarriagePos.line++
              moveCarriageToClosestSymbol(state.lines[index + 1])
            }
            break
          case 'up':
            if (state.lines[index - 1]) {
              state.currentCarriagePos.line--
              moveCarriageToClosestSymbol(state.lines[index - 1])
            }
            break
          case 'left':
            if (line[indexInLine - 1]) {
              state.currentCarriagePos.indexInLine--
            }
            break
          case 'right':
            if (line[indexInLine]) {
              state.currentCarriagePos.indexInLine++
            }
            break
          default:
            throw Error(`Wrong direction ${direction}`)
        }
      })
    },

    // getters
    getCurrentLine: () => get().lines[get().currentCarriagePos.line],
    getCurrentIndexInLine: () => get().currentCarriagePos.indexInLine,
    getCurrentLineIndex: () => get().currentCarriagePos.line,
    getCurrent: () => ({
      line: get().getCurrentLine(),
      index: get().getCurrentLineIndex(),
      indexInLine: get().getCurrentIndexInLine(),
    }),

    getText: () => {
      let codeText = ''
      const { start, finish } = get().selectionRange

      if (!start || !finish) throw Error('nothing to select')

      const initialLines = get().lines

      const startLine = initialLines[start.line].slice(start.indexInLine)

      const finishLine = initialLines[finish.line].slice(0, finish.indexInLine)

      const lines = [
        startLine,
        ...initialLines.slice(start.line, finish.line + 1),
        finishLine,
      ]

      lines.forEach((line, lineIndex) => {
        line.forEach((symbol) => {
          codeText += symbol.value
        })
        if (lineIndex !== lines.length - 1) {
          codeText += '\n'
        }
      })

      return codeText
    },

    isSelectionActive: () => {
      return !!(get().selectionRange.start && get().selectionRange.finish)
    },
  }))
)
