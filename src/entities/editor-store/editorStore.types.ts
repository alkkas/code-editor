export interface ISymbol {
  value: string
  color?: string
}

export interface IPosition {
  line: number
  indexInLine: number
}

export interface IEditorStore {
  currentCarriagePos: IPosition
  isFocused: boolean
  lines: ISymbol[][]

  //setters
  setFocus: (v: boolean) => void
  addNewSymbol: (newSymbol: ISymbol, position?: IPosition) => void
  deleteSymbol: () => void
  moveCarriage: (direction: 'up' | 'down' | 'left' | 'right') => void

  //getters
  getCurrentLine: () => ISymbol[]
  getCurrentIndexInLine: () => number
  getCurretLineIndex: () => number
}
