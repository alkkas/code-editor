import { languagesMap } from '@/model/languages/map'
import { IEditorStore } from '../../editorStore.types'
import { SetType } from '../common'
import SyntaxHighlighterWorker from './syntaxHighlighter.worker?worker&inline'
import { IEditorStoreData, getStoreData } from '@/store/editorStore.initial'
import { ILexTheme } from '@/model/lex/lexTheme.model'
import { LexModel } from '@/model/lex/lex.model'

export interface ISyntaxHighlighter {
  highlightSyntax: () => void
  updateSymbolColors: (e: MessageEvent<IColorRanges>) => void
}
export interface IOneLineRange {
  lineIndex: number
  start: number
  finish: number
}

export type IColorRanges = { range: IOneLineRange; color: string }[]

export interface ISyntaxHighlighterDto extends IEditorStoreData {
  langConf: LexModel<ILexTheme>
}

export default function getSyntaxHighlighter(
  get: () => IEditorStore,
  set: SetType
): ISyntaxHighlighter {
  if (!window.Worker) throw new Error('you browser does not support workers')

  const worker = new SyntaxHighlighterWorker()

  worker.onmessage = (e: MessageEvent<IColorRanges>) => {
    console.log('message')
    get().updateSymbolColors(e)
  }

  return {
    highlightSyntax: () => {
      worker.postMessage({
        ...getStoreData(),
        langConf: languagesMap[get().highlighter.language],
      })
    },
    updateSymbolColors: (e) => {
      set((state) => {
        console.log(state.lines[0].length, 'statetete', e.data)
        e.data.forEach(({ range, color }) => {
          state.lines[range.lineIndex]?.forEach((symbol, index) => {
            if (index >= range.start && index <= range.finish) {
              symbol.color = color
            }
          })
        })
      })
    },
  }
}
