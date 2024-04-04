import { IEditorStore, IRange, ISymbol } from './editorStore.types'

export default function getEditorStoreGetters(get: () => IEditorStore) {
  return {
    getCurrentLine: () => get().lines[get().currentCarriagePos.line],
    getCurrentIndexInLine: () => get().currentCarriagePos.indexInLine,
    getCurrentLineIndex: () => get().currentCarriagePos.line,
    getCurrent: () => ({
      line: get().getCurrentLine(),
      index: get().getCurrentLineIndex(),
      indexInLine: get().getCurrentIndexInLine(),
    }),
    isSelectionRange() {
      const { start, finish } = get().selectionRange

      if (!start || !finish) return false

      return true
    },
    getText: (range: IRange) => {
      let codeText = ''

      const { start, finish } = range

      if (!start || !finish) throw Error('nothing to select')

      const initialLines = get().lines

      const startLine = initialLines[start.line].slice(start.indexInLine)

      const finishLine =
        start.line !== finish.line
          ? initialLines[finish.line].slice(0, finish.indexInLine)
          : undefined

      const lines: ISymbol[][] = []

      lines.push(startLine, ...initialLines.slice(start.line, finish.line))

      if (finishLine) {
        lines.push(finishLine)
      }

      lines.forEach((line, lineIndex) => {
        line.forEach((symbol) => {
          codeText += symbol.value
        })
        if (lineIndex !== lines.length - 1) {
          codeText += '\n'
        }
      })

      return codeText
    },

    isSelectionActive: () => {
      return !!(get().selectionRange.start && get().selectionRange.finish)
    },
  }
}

export type IEditorStoreGetters = ReturnType<typeof getEditorStoreGetters>
