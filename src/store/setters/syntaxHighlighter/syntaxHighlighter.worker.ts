import { defaultEditorTextTheme } from '@/model/editor-types'
import { languagesMap } from '@/model/languages/map'
import { Itoken } from '@/model/lex/lex.model'
import { ILexTheme } from '@/model/lex/lexTheme.model'
import { IEditorStoreData } from '@/store/editorStore.initial'

interface IOneLineRange {
  lineIndex: number
  start: number
  finish: number
}

const paintSymbols = (
  range: IOneLineRange,
  color: string,
  state: IEditorStoreData
) => {
  state.lines[range.lineIndex].forEach((symbol, index) => {
    if (index >= range.start && index <= range.finish) {
      symbol.color = color
    }
  })
}

const isTokenArray = (token: keyof ILexTheme) => {
  return token[0] === '$'
}

self.onmessage = (e: MessageEvent<IEditorStoreData>) => {
  const store = e.data
  const language = e.data.highlighter.language
  let theme = e.data.highlighter.editorText

  if (!theme) theme = defaultEditorTextTheme
  const langConf = languagesMap[language]

  let currentTokens: Itoken<typeof theme> | null = null

  let currentText = ''

  const range: IOneLineRange = {
    lineIndex: 0,
    start: 0,
    finish: 0,
  }

  for (let lineIndex = 0; lineIndex < store.lines.length; lineIndex++) {
    const line = store.lines[lineIndex]
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
          paintSymbols(range, color, store)

          currentTokens = null

          if (tkn === currentTokens?.[1]) {
            currentText = ''
            range.start = range.finish
          }

          break
        }

        if (color) {
          paintSymbols(range, color, store)
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

  self.postMessage(store.lines)
}
