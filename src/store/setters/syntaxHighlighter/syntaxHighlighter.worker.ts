import { Itoken } from '@/model/lex/lex.model'
import { ILexTheme } from '@/model/lex/lexTheme.model'
import {
  IColorRanges,
  IOneLineRange,
  ISyntaxHighlighterDto,
} from './syntaxHighlighter'

const isTokenArray = (token: keyof ILexTheme) => {
  return token[0] === '$'
}

class ColorRange {
  #ranges: IColorRanges = []

  addRange(range: IOneLineRange, color: string) {
    this.#ranges.push(structuredClone({ range, color }))
  }

  getRanges(): IColorRanges {
    return this.#ranges
  }
}

self.onmessage = (e: MessageEvent<ISyntaxHighlighterDto>) => {
  const store = e.data
  const theme = e.data.highlighter.editorText
  const langConf = e.data.langConf

  if (!langConf) return

  const colorRanges = new ColorRange()

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
          colorRanges.addRange(range, color)

          currentTokens = null

          if (tkn === currentTokens?.[1]) {
            currentText = ''
            range.start = range.finish
          }

          break
        }

        if (color) {
          colorRanges.addRange(range, color)
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

  self.postMessage(colorRanges.getRanges())
}
