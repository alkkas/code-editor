import { IEditorStore } from '../editorStore.types'
import getSyntaxHighlighter, { ISyntaxHighlighter } from './syntaxHighlighter'
import { ICarriageSetters, getCarriageSetters } from './carriage'
import {
  CommonSettersObj,
  SetType,
  commonSetters,
  mapCommonSetters,
} from './common'
import { ISymbolSetters, getSymbolSetters } from './symbol'
import { IMiscSetters, getMiscSetters } from './misc'

export default function getEditorStoreSetters(
  get: () => IEditorStore,
  set: SetType
) {
  return {
    ...mapCommonSetters(commonSetters, set),

    ...getCarriageSetters(get, set),

    ...getSymbolSetters(get, set),

    ...getMiscSetters(get, set),

    ...getSyntaxHighlighter(get, set),
  }
}

// Explicit store setters type declaration.
// When declared with inferring dependency cycle error is thrown
export type IEditorStoreSetters = CommonSettersObj &
  ICarriageSetters &
  ISyntaxHighlighter &
  IMiscSetters &
  ISymbolSetters
