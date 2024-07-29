import { ILexTheme } from '@/app/model/lex/lexTheme.model'
import { IEditorStore } from '../editorStore.types'
import { languagesMap } from '@/app/model/languages/map'
import { Itoken } from '@/app/model/lex/lex.model'
import { SetType } from './common'

interface IOneLineRange {
  lineIndex: number
  start: number
  finish: number
}

export interface ISyntaxHighlighter {
  highlightSyntax: () => void
}

const isTokenArray = (token: keyof ILexTheme) => {
  return token[0] === '$'
}

export default function getSyntaxHighlighter(
  get: () => IEditorStore,
  set: SetType
): ISyntaxHighlighter {
  const paintSymbols = (range: IOneLineRange, color: string) => {
    set((state) => {
      state.lines[range.lineIndex].forEach((symbol, index) => {
        if (index >= range.start && index <= range.finish) {
          symbol.color = color
        }
      })
    })
  }
  return {
    highlightSyntax: () => {
      const language = get().highlighter.language

      const langConf = languagesMap[language]
      const theme = get().highlighter.editorText
      let currentTokens: Itoken<typeof theme> | null = null

      let currentText = ''

      const range: IOneLineRange = {
        lineIndex: 0,
        start: 0,
        finish: 0,
      }

      for (let lineIndex = 0; lineIndex < get().lines.length; lineIndex++) {
        const line = get().lines[lineIndex]
        range.lineIndex = lineIndex

        for (let symbolIndex = 0; symbolIndex < line.length; symbolIndex++) {
          const symbol = line[symbolIndex]
          range.finish = symbolIndex
          let clearText = false
          if (symbol.value !== ' ') {
            currentText += symbol.value
          } else {
            clearText = true
          }

          for (const token of langConf.tokenizer) {
            if (currentText.match(token[0])?.includes(currentText)) {
              currentTokens = token
            }
          }

          if (currentTokens) {
            let color: string | undefined

            for (const token of currentTokens.slice(1)) {
              if (color) break

              const tkn = token as keyof ILexTheme

              if (isTokenArray(tkn)) {
                //@ts-ignore
                const tknArr = langConf[tkn] as string[]

                if (tknArr?.includes(currentText)) color = theme[tkn]
                continue
              }

              color = theme[tkn]
              paintSymbols(range, color)

              currentTokens = null

              if (tkn === currentTokens?.[1]) {
                currentText = ''
                range.start = range.finish
              }

              break
            }

            if (color) {
              paintSymbols(range, color)
              currentTokens = null
            }
          }

          if (clearText) {
            currentText = ''
            range.start = range.finish
          }
        }

        currentText = ''
        currentTokens = null
        range.start = 0
        range.finish = 0
      }
    },
  }
}
