import { IEditorStoreGetters } from './editorStore.getters'
import { IEditorStoreData } from './editorStore.initial'
import { IEditorStoreSetters } from './editorStore.setters'

export interface ISymbol {
  value: string
  color?: string
}

export interface IPosition {
  lineIndex: number
  indexInLine: number
}

export interface IRange {
  start: IPosition | undefined
  finish: IPosition | undefined
}

export type IEditorStore = IEditorStoreSetters &
  IEditorStoreGetters &
  IEditorStoreData
