import { IPosition, IRange, ISymbol } from './editorStore.types'

export default function getEditorStoreInitialState() {
  return {
    buffer: [[]] as ISymbol[][],
    currentCarriagePos: { lineIndex: 0, indexInLine: 0 } as IPosition,
    isFocused: false,
    lines: [[]] as ISymbol[][],
    selectionRange: { start: undefined, finish: undefined } as IRange,
  }
}

export type IEditorStoreData = ReturnType<typeof getEditorStoreInitialState>
