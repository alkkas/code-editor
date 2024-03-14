import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { IEditorStore } from '@/entities/editor-store/editorStore.types'

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

    addNewSymbol: (newSymbol, position) => {
      set((state) => {
        const currentLine =
          state.lines[position?.line ?? state.currentCarriagePos.line]
        const index =
          position?.indexInLine ?? state.currentCarriagePos.indexInLine

        state.lines[state.currentCarriagePos.line] = [
          ...currentLine.slice(0, index),
          newSymbol,
          ...currentLine.slice(index),
        ]

        state.currentCarriagePos.indexInLine++
      })
    },

    deleteSymbol: () => {
      set((state) => {
        const currentLine = state.getCurrentLine()
        const index = state.getCurrentIndexInLine()

        state.lines[state.getCurretLineIndex()] = [
          ...currentLine.slice(0, index - 1),
          ...currentLine.slice(index),
        ]
        state.currentCarriagePos.indexInLine--
      })
    },

    moveCarriage: (direction) => {
      set((state) => {
        switch (direction) {
          case 'down':
            if (state.lines[state.getCurretLineIndex() + 1]) {
              state.currentCarriagePos.line++
            }
            break
          case 'up':
            if (state.lines[state.getCurretLineIndex() + 1]) {
              state.currentCarriagePos.line--
            }
            break
          case 'left':
            if (state.getCurrentLine()[state.getCurrentIndexInLine() - 1]) {
              state.currentCarriagePos.indexInLine--
            }
            break
          case 'right':
            if (state.getCurrentLine()[state.getCurrentIndexInLine() + 1]) {
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
    getCurretLineIndex: () => get().currentCarriagePos.line,
  }))
)
