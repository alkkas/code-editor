import { IEditorStore, IPosition, ISymbol } from '../editorStore.types'
import { SetType } from './common'

export interface ICarriageSetters {
  setCarriagePos: (pos: IPosition) => void
  moveCarriage: (direction: 'up' | 'down' | 'left' | 'right') => void
}

export const getCarriageSetters = (
  get: () => IEditorStore,
  set: SetType
): ICarriageSetters => {
  return {
    setCarriagePos(pos) {
      set((state) => {
        if (pos.lineIndex !== undefined) {
          state.currentCarriagePos.lineIndex = pos.lineIndex
        }
        if (pos.indexInLine !== undefined) {
          state.currentCarriagePos.indexInLine = pos.indexInLine
        }
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
              state.currentCarriagePos.lineIndex++
              moveCarriageToClosestSymbol(state.lines[index + 1])
            }
            break
          case 'up':
            if (state.lines[index - 1]) {
              state.currentCarriagePos.lineIndex--
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
  }
}
