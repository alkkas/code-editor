export interface ISymbol {
  value: string
  color?: string
}

export interface IPosition {
  line: number
  indexInLine: number
}

export interface IRange {
  start: IPosition | undefined
  finish: IPosition | undefined
}

export interface IEditorStore {
  currentCarriagePos: IPosition
  isFocused: boolean
  lines: ISymbol[][]
  selectionRange: IRange

  //setters
  setFocus: (v: boolean) => void
  addNewSymbol: (...newSymbols: ISymbol[]) => void
  deleteSymbol: () => void
  moveCarriage: (direction: 'up' | 'down' | 'left' | 'right') => void
  changeCurrentLine: (line: ISymbol[]) => void
  createNewLine: () => void
  deleteLine: (lineIndex: number) => void
  setCarriagePos: (pos: Partial<IPosition>) => void
  cut: () => void

  //getters
  getCurrentLine: () => ISymbol[]
  getCurrentIndexInLine: () => number
  getCurrentLineIndex: () => number
  getCurrent: () => {
    line: ISymbol[]
    index: number
    indexInLine: number
  }
  getText: (range: IRange) => string
  isSelectionActive: () => boolean
  isSelectionRange: () => boolean
}
