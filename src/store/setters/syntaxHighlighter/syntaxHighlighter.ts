import { ILexTheme } from '@/app/model/lex/lexTheme.model'
import { IEditorStore, ISymbol } from '../../editorStore.types'
import { LanguageName } from '@/app/model/languages/map'
import { defaultEditorTextTheme } from '@/app/model/editor-types'
import { SetType } from '../common'
import { ISyntaxHighlighterMessage } from './syntaxHighlighter.worker'
import SyntaxHighlightWorker from 'web-worker:./syntaxHighlighter.worker.ts'

export interface ISyntaxHighlighter {
  highlightSyntax: (
    language: LanguageName,
    theme: ILexTheme | undefined
  ) => void
}

export default function getSyntaxHighlighter(
  get: () => IEditorStore,
  set: SetType
): ISyntaxHighlighter {
  if (!window.Worker) throw new Error('you browser does not support workers')

  const worker = new SyntaxHighlightWorker()

  worker.onmessage = (e: MessageEvent<ISymbol[][]>) => {
    set((state) => {
      state.lines = e.data
    })
  }

  return {
    highlightSyntax: (language, theme = defaultEditorTextTheme) => {
      const workerMsg: ISyntaxHighlighterMessage = {
        params: [language, theme],
        store: JSON.parse(JSON.stringify(get())),
      }
      worker.postMessage(workerMsg)
    },
  }
}
