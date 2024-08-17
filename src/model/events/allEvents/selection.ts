import { EventMap } from '@/utils/types/types'
import {
  getCoords,
  lineElement,
  symbolElement,
} from '@/utils/lib/getElements.helpers'
import { useEditorStore } from '@/store/editorStore'
import { IPosition } from '@/store/editorStore.types'
import { GetEventsFunc } from './events.model'

export const getSelectionEvents: GetEventsFunc = (element) => {
  const events: EventMap = {
    // selection start
    mousedown(evt: MouseEvent) {
      const editorStore = useEditorStore.getState()

      editorStore.clearSelectionRange()

      if (!evt.target) return

      const coords = getCoords(evt.target as HTMLElement)

      editorStore.changeSelectionRange({
        start: { indexInLine: coords.indexInLine, lineIndex: coords.lineIndex },
      })

      editorStore.setCarriagePos({
        lineIndex: coords.lineIndex,
        indexInLine: coords.indexInLine,
      })

      editorStore.setFocus(true)

      element.addEventListener(
        'mousemove',
        events.mousemove as (evt: MouseEvent) => unknown
      )
    },

    // end selection
    mouseup() {
      element.removeEventListener(
        'mousemove',
        events.mousemove as (evt: MouseEvent) => unknown
      )
    },

    // selection change
    mousemove(evt: MouseEvent) {
      const editorStore = useEditorStore.getState()
      const mouseCoords = { x: evt.x, y: evt.y }

      if (!editorStore.selectionRange.start) return

      const carriageCoords: IPosition = {
        lineIndex: editorStore.selectionRange.start.lineIndex,
        indexInLine: editorStore.selectionRange.start.indexInLine,
      }

      for (
        let lineIndex = 0;
        lineIndex < editorStore.lines.length;
        lineIndex++
      ) {
        const lineDom = document.querySelector(
          lineElement(lineIndex)
        ) as HTMLElement | null

        if (!lineDom) throw Error('line not found')

        const lineY = lineDom.getBoundingClientRect().y

        const isCursorBetweenLine =
          (mouseCoords.y > lineY &&
            mouseCoords.y < lineY + lineDom.offsetHeight) ||
          lineY > mouseCoords.y

        if (!isCursorBetweenLine && lineIndex !== editorStore.lines.length - 1)
          continue

        carriageCoords.lineIndex = lineIndex

        const currentLine = editorStore.lines[lineIndex]

        if (!currentLine.length) carriageCoords.indexInLine = 0

        for (
          let indexInLine = 0;
          indexInLine < currentLine.length;
          indexInLine++
        ) {
          const symbolDom = document.querySelector(
            symbolElement({ lineIndex, indexInLine })
          ) as HTMLElement | null

          if (!symbolDom) throw Error('symbol not found')

          const symbolX = symbolDom.getBoundingClientRect().x

          if (symbolX < mouseCoords.x && indexInLine !== currentLine.length - 1)
            continue

          carriageCoords.indexInLine = indexInLine

          if (indexInLine === currentLine.length - 1) {
            carriageCoords.indexInLine++
          }

          break
        }

        break
      }

      editorStore.changeSelectionRange({
        finish: carriageCoords,
      })

      editorStore.setCarriagePos({
        lineIndex: carriageCoords.lineIndex,
        indexInLine: carriageCoords.indexInLine,
      })
    },
  }

  return { events, hiddenEventsNames: ['mousemove'] }
}
