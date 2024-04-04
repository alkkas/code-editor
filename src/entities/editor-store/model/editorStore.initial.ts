import { IPosition, IRange, ISymbol } from './editorStore.types'

export default function getEditorStoreInitialState() {
  return {
    currentCarriagePos: { line: 0, indexInLine: 0 } as IPosition,
    isFocused: false,
    lines: [[]] as ISymbol[][],
    selectionRange: { start: undefined, finish: undefined } as IRange,
  }
}

export type IEditorStoreData = ReturnType<typeof getEditorStoreInitialState>
