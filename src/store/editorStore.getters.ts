import { IEditorStore, IRange, ISymbol } from './editorStore.types'

export default function getEditorStoreGetters(get: () => IEditorStore) {
  return {
    getCurrentLine: () => get().lines[get().currentCarriagePos.lineIndex],
    getCurrentIndexInLine: () => get().currentCarriagePos.indexInLine,
    getCurrentLineIndex: () => get().currentCarriagePos.lineIndex,
    getCurrent: () => ({
      line: get().getCurrentLine(),
      index: get().getCurrentLineIndex(),
      indexInLine: get().getCurrentIndexInLine(),
    }),
    getSelectionRange() {
      const { start, finish } = get().selectionRange

      if (!start || !finish) throw Error('no range')

      let vStart = start
      let vFinish = finish

      if (
        vStart.lineIndex > vFinish.lineIndex ||
        (vStart.lineIndex === vFinish.lineIndex &&
          vStart.indexInLine > vFinish.indexInLine)
      ) {
        const startTemp = vStart
        const finishTemp = vFinish

        vStart = finishTemp
        vFinish = startTemp
      }

      return { start: vStart, finish: vFinish }
    },

    getText: (range: IRange) => {
      const { start, finish } = range

      if (!start || !finish) throw Error('nothing to select')

      const initialLines = get().lines

      const startLine = initialLines[start.lineIndex].slice(start.indexInLine)

      if (start.lineIndex === finish.lineIndex) {
        startLine.splice(0, finish.indexInLine)
      }

      const finishLine =
        start.lineIndex !== finish.lineIndex
          ? initialLines[finish.lineIndex].slice(0, finish.indexInLine + 1)
          : undefined

      const lines: ISymbol[][] = []

      lines.push(
        startLine,
        ...initialLines.slice(start.lineIndex + 1, finish.lineIndex)
      )

      if (finishLine) {
        lines.push(finishLine)
      }

      let codeText = ''
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

    parseText(text: string) {},

    isSelectionActive: () => {
      return !!(get().selectionRange.start && get().selectionRange.finish)
    },
  }
}

export type IEditorStoreGetters = ReturnType<typeof getEditorStoreGetters>
