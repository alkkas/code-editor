import { IEditorStore, ISymbol } from '../../editorStore.types'
import { SetType } from '../common'
import SyntaxHighlightWorker from 'web-worker:./syntaxHighlighter.worker.ts'

export interface ISyntaxHighlighter {
  highlightSyntax: () => void
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
    highlightSyntax: () => {
      const workerMsg = JSON.parse(JSON.stringify(get()))
      worker.postMessage(workerMsg)
    },
  }
}
