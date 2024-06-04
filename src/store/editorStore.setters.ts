import { WritableDraft } from '@/shared/utils/types/types'
import { IEditorStore, IPosition, ISymbol, IRange } from './editorStore.types'
import { LanguageName, languagesMap } from '@/app/model/languages/map'
import { ILexTheme } from '@/app/model/lex/lexTheme.model'
import { Itoken } from '@/app/model/lex/lex.model'

// TODO: implement later

// type IAdditionalSetters = Record<string, (...args: unknown[]) => unknown>

// function mapAdditonalSetters(
//   additionalSetters: IAdditionalSetters,
//   set: IZustandSet
// ) {
//   return Object.entries(additionalSetters).reduce<IAdditionalSetters>(
//     (acc, [key, value]) => {
//       acc[key] = (...args: unknown[]) => set((state) => value(...args, state))
//     },
//     {}
//   )
// }

// const additionalEditorSetters: IAdditionalSetters = {
// deleteLine: (index: number, state: WritableDraft<IEditorStore>) => {
//   state.lines = [
//     ...state.lines.slice(0, index),
//     ...state.lines.slice(index + 1, state.lines.length),
//   ]
// },
// }

const _deleteLine = (index: number, state: WritableDraft<IEditorStore>) => {
  state.lines = [
    ...state.lines.slice(0, index),
    ...state.lines.slice(index + 1, state.lines.length),
  ]
}

export default function getEditorStoreSetters(
  get: () => IEditorStore,
  set: (
    nextStateOrUpdater:
      | IEditorStore
      | Partial<IEditorStore>
      | ((state: WritableDraft<IEditorStore>) => void),
    shouldReplace?: boolean | undefined
  ) => void
) {
  return {
    setFocus: (value: boolean) =>
      set((state) => {
        state.isFocused = value
      }),

    setCarriagePos(pos: IPosition) {
      set((state) => {
        if (pos.lineIndex !== undefined) {
          state.currentCarriagePos.lineIndex = pos.lineIndex
        }
        if (pos.indexInLine !== undefined) {
          state.currentCarriagePos.indexInLine = pos.indexInLine
        }
      })
    },

    changeCurrentLine(line: ISymbol[]) {
      set((state) => {
        state.lines[state.getCurrentLineIndex()] = line
      })
    },

    addNewSymbol(...newSymbols: ISymbol[]) {
      const { indexInLine, line } = get().getCurrent()

      newSymbols.forEach((symbol) => {
        get().changeCurrentLine([
          ...line.slice(0, indexInLine),
          symbol,
          ...line.slice(indexInLine),
        ])

        set((state) => {
          state.currentCarriagePos.indexInLine++
        })
      })
    },

    deleteSymbol() {
      const { indexInLine, line, index } = get().getCurrent()

      if (indexInLine === 0) {
        if (index === 0) return

        set((state) => {
          state.lines = [
            ...state.lines.slice(0, index),
            ...state.lines.slice(index + 1),
          ]

          state.lines[index - 1] = [...state.lines[index - 1], ...line]

          state.currentCarriagePos.indexInLine =
            state.lines[index - 1].length - line.length
          state.currentCarriagePos.lineIndex = index - 1
        })

        return
      }

      get().changeCurrentLine([
        ...line.slice(0, indexInLine - 1),
        ...line.slice(indexInLine),
      ])

      set((state) => {
        state.currentCarriagePos.indexInLine--
      })
    },

    createNewLine() {
      set((state) => {
        const { index, indexInLine, line } = state.getCurrent()

        const oldLine = line.slice(0, indexInLine)
        const newLine = line.slice(indexInLine)

        state.lines = [
          ...state.lines.slice(0, index),
          oldLine,
          newLine,
          ...state.lines.slice(index + 1),
        ]

        state.currentCarriagePos.lineIndex++
        state.currentCarriagePos.indexInLine = 0
      })
    },

    moveCarriage: (direction: 'up' | 'down' | 'left' | 'right') => {
      set((state) => {
        const moveCarriageToClosestSymbol = (line: ISymbol[]) => {
          if (line.length < state.currentCarriagePos.indexInLine) {
            state.currentCarriagePos.indexInLine = line.length
          }
        }

        const { index, indexInLine, line } = state.getCurrent()

        switch (direction) {
          case 'down':
            if (state.lines[index + 1]) {
              state.currentCarriagePos.lineIndex++
              moveCarriageToClosestSymbol(state.lines[index + 1])
            }
            break
          case 'up':
            if (state.lines[index - 1]) {
              state.currentCarriagePos.lineIndex--
              moveCarriageToClosestSymbol(state.lines[index - 1])
            }
            break
          case 'left':
            if (line[indexInLine - 1]) {
              state.currentCarriagePos.indexInLine--
            }
            break
          case 'right':
            if (line[indexInLine]) {
              state.currentCarriagePos.indexInLine++
            }
            break
          default:
            throw Error(`Wrong direction ${direction}`)
        }
      })
    },

    deleteLine(index: number) {
      set((state) => _deleteLine(index, state))
    },

    copyToClipboard(range: IRange) {
      const text = get().getText(range)
      navigator.clipboard.writeText(text)
    },

    async pasteText(text: string) {
      const lines = get().parseText(text)

      if (!lines.length) return

      set((state) => {
        let currentLine = state.getCurrentLine()

        currentLine = state.lines[state.currentCarriagePos.lineIndex] = [
          ...currentLine,
          ...lines[0],
        ]

        state.lines = [
          ...state.lines.slice(0, state.currentCarriagePos.lineIndex),
          currentLine,
          ...lines.slice(1),
          ...state.lines.slice(state.currentCarriagePos.lineIndex + 1),
        ]
      })
    },

    changeSelectionRange(range: Partial<IRange>) {
      set((state) => {
        if (range.start) {
          state.selectionRange.start = range.start
        }
        if (range.finish) {
          state.selectionRange.finish = range.finish
        }
      })
    },
    clearSelectionRange() {
      set((state) => {
        state.selectionRange = { start: undefined, finish: undefined }
      })
    },
    cut() {
      if (get().isSelectionActive()) {
        // selection
      } else {
        const { index, line } = get().getCurrent()

        get().copyToClipboard({
          start: { lineIndex: index, indexInLine: 0 },
          finish: { lineIndex: index, indexInLine: line.length },
        })

        set((state) => {
          if (state.lines.length !== 1) {
            _deleteLine(index, state)
            state.currentCarriagePos.lineIndex--
          } else {
            state.lines = [[]]
          }

          state.currentCarriagePos.indexInLine = 0
        })
      }
    },
    highLightSyntax(language: LanguageName, theme: ILexTheme) {
      const langConf = languagesMap[language]

      let currentToken: Itoken<typeof theme> | null = null

      let currentText = ''

      for (const line of get().lines) {
        for (const symbol of line) {
          currentText += symbol.value

          if (currentToken) {
            if (currentText.match(currentToken[0])) {
            }
            if (!currentText.match(currentToken[0])) currentToken = null
          }

          for (const token of langConf.tokenizer) {
            if (currentText.match(token[0])) {
              currentToken = token
            }
          }
        }
      }
    },
  }
}

export type IEditorStoreSetters = ReturnType<typeof getEditorStoreSetters>
