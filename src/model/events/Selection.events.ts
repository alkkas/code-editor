import { EventMap } from '@/utils/types/types'
import {
  getCoords,
  lineElement,
  symbolElement,
} from '@/utils/lib/getElements.helpers'
import { EventBase } from './Event.base'
import { useEditorStore } from '@/store/editorStore'
import { IPosition } from '@/store/editorStore.types'
import { DEFAULT_FONT_SIZE } from '@/ui/Editor'

export class SelectionEvents implements EventBase {
  events: EventMap = {
    mousedown: this.startSelection.bind(this),
    mouseup: this.endSelection.bind(this),
  }

  private mouseMoveEvent = this.updateSelection.bind(this)

  constructor(private element: HTMLElement) {}

  private startSelection(evt: MouseEvent) {
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
    this.element.addEventListener('mousemove', this.mouseMoveEvent)
  }

  private updateSelection(evt: MouseEvent) {
    const editorStore = useEditorStore.getState()
    const mouseCoords = { x: evt.x, y: evt.y }

    if (!editorStore.selectionRange.start) return

    const carriageCoords: IPosition = {
      lineIndex: editorStore.selectionRange.start.lineIndex,
      indexInLine: editorStore.selectionRange.start.indexInLine,
    }

    for (let lineIndex = 0; lineIndex < editorStore.lines.length; lineIndex++) {
      const lineDom = document.querySelector(
        lineElement(lineIndex)
      ) as HTMLElement | null

      if (!lineDom) throw Error('line not found')

      const lineY = lineDom.getBoundingClientRect().y

      const isCursorBetweenLine =
        (mouseCoords.y > lineY && mouseCoords.y < lineY + DEFAULT_FONT_SIZE) ||
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
  }

  private endSelection() {
    this.element.removeEventListener('mousemove', this.mouseMoveEvent)
  }
}
