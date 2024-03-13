import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { combine } from 'zustand/middleware'

interface ISymbol {
  value: string
  color?: string
}
interface IEditorStore {
  currentCarriagePos: { line: number; lineIndex: number }
  isFocused: boolean
  lines: ISymbol[][]
}

export const useEditorStore = create(
  immer(
    combine(
      {
        currentCarriagePos: { line: 0, lineIndex: 0 },
        isFocused: false,
        lines: [[{ value: 'a' }, { value: 'b' }]],
      } as IEditorStore,
      (set) => ({
        setFocus: (value: boolean) => set((state) => (state.isFocused = value)),
      })
    )
  )
)
