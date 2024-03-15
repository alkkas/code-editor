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

    // setters
    setFocus: (value) =>
      set((state) => {
        state.isFocused = value
      }),

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
      const { indexInLine, line } = get().getCurrent()

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
  }))
)
