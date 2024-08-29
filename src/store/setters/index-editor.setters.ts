import { IEditorStore } from '../editorStore.types'
import getSyntaxHighlighter, {
  ISyntaxHighlighter,
} from './syntaxHighlighter/syntaxHighlighter'
import { ICarriageSetters, getCarriageSetters } from './carriage'
import {
  CommonSettersObj,
  SetType,
  commonSetters,
  mapCommonSetters,
} from './common'
import { ISymbolSetters, getSymbolSetters } from './symbol'
import { IMiscSetters, getMiscSetters } from './misc'
import { ISelectionSetters, getSelectionSetters } from './selection'
import { IPropsSetters, setProps } from '@/store/setters/setProps'

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

    ...getSelectionSetters(get, set),

    ...setProps(get, set),
  }
}

// Explicit store setters type declaration.
// When declared with "ts type inferring" dependency cycle error is thrown
export type IEditorStoreSetters = CommonSettersObj &
  ICarriageSetters &
  ISyntaxHighlighter &
  IMiscSetters &
  ISymbolSetters &
  ISelectionSetters &
  IPropsSetters
