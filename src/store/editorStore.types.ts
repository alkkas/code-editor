import { IEditorStoreGetters } from './editorStore.getters'
import { IEditorStoreData } from './editorStore.initial'
import { IEditorStoreSetters } from './setters/editorStore.setters'

export interface ISymbol {
  value: string
  color?: string
  x?: number
  y?: number
}

export interface IPosition {
  lineIndex: number
  indexInLine: number
}
export interface IFullRange {
  start: IPosition
  finish: IPosition
}
export type IRange = Partial<IFullRange>

export type IEditorStore = IEditorStoreSetters &
  IEditorStoreGetters &
  IEditorStoreData
