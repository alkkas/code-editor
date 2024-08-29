import { LanguageName } from '@/model/languages/map'
import { IPosition, IRange, ISymbol } from './editorStore.types'
import { ILexTheme } from '@/model/lex/lexTheme.model'
import { defaultEditorTextTheme } from '@/model/editor-types'

export default function getEditorStoreInitialState() {
  return {
    highlighter: {
      language: 'typescript' as LanguageName,
      editorText: defaultEditorTextTheme as ILexTheme,
    },
    buffer: [[]] as ISymbol[][],
    currentCarriagePos: { lineIndex: 0, indexInLine: 0 } as IPosition,
    isFocused: false,
    lines: [[]] as ISymbol[][],
    selectionRange: { start: undefined, finish: undefined } as IRange,
  }
}

export type IEditorStoreData = ReturnType<typeof getEditorStoreInitialState>
