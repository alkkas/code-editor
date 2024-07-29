import { LanguageName } from '@/app/model/languages/map'
import { IPosition, IRange, ISymbol } from './editorStore.types'
import { ILexTheme } from '@/app/model/lex/lexTheme.model'
import { defaultEditorTextTheme } from '@/app/model/editor-types'

export default function getEditorStoreInitialState() {
  return {
    highlighter: {
      language: 'typescript',
      editorText: defaultEditorTextTheme,
    } as {
      editorText: ILexTheme
      language: LanguageName
    },
    buffer: [[]] as ISymbol[][],
    currentCarriagePos: { lineIndex: 0, indexInLine: 0 } as IPosition,
    isFocused: false,
    lines: [[]] as ISymbol[][],
    selectionRange: { start: undefined, finish: undefined } as IRange,
    language: {
      name: null as LanguageName | null,
      theme: defaultEditorTextTheme as ILexTheme,
    },
  }
}

export type IEditorStoreData = ReturnType<typeof getEditorStoreInitialState>
