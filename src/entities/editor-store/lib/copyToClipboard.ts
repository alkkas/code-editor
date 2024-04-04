import { useEditorStore } from '../model/editorStore'
import { IRange } from '../model/editorStore.types'

const editorStore = useEditorStore.getState()

function copyToClipboard(range: IRange) {
  //   const selection = window.getSelection()

  //   const startNode = selection?.anchorNode?.parentElement
  //   const finishNode = selection?.focusNode?.parentElement

  //   if (!startNode || !finishNode) {
  //     // eslint-disable-next-line no-console
  //     console.warn('start or finish nodes are not exist')
  //     return
  //   }

  //   const indexes = [
  //     getClosestLine(startNode)?.getAttribute(lineAttr),
  //     getClosestSymbol(startNode)?.getAttribute(symbolAttr),
  //     getClosestLine(finishNode)?.getAttribute(lineAttr),
  //     getClosestSymbol(finishNode)?.getAttribute(symbolAttr),
  //   ]

  //   if (indexes.every((index) => index !== undefined || index !== null)) {
  //     //@ts-expect-error INTENTIONAL
  //     range.start.line = +indexes[0]
  //     //@ts-expect-error INTENTIONAL
  //     range.start.indexInLine = +indexes[1]
  //     //@ts-expect-error INTENTIONAL
  //     range.finish.line = +indexes[2]
  //     //@ts-expect-error INTENTIONAL
  //     range.finish.indexInLine = +indexes[3]
  //   }

  const text = editorStore.getText(range)
  navigator.clipboard.writeText(text)
}
export default copyToClipboard
