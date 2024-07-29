import { EventMap } from '@/shared/utils/types/types'
import { getCoords } from '../../lib/getElements.helpers'
import { EventBase } from './Event.base'
import { useEditorStore } from '@/store/editorStore'

export class SelectionEvents implements EventBase {
  events: EventMap = {
    mousedown: this.startSelection.bind(this),
    mouseup: this.endSelection.bind(this),
  }

  private mouseMoveEvent = this.updateSelection.bind(this)

  constructor(private element: HTMLElement) {}

  editorStore = useEditorStore.getState()

  private startSelection(evt: MouseEvent) {
    this.editorStore.clearSelectionRange()

    if (!evt.target) return

    const coords = getCoords(evt.target as HTMLElement)

    this.editorStore.changeSelectionRange({
      start: { indexInLine: coords.indexInLine, lineIndex: coords.lineIndex },
    })

    this.editorStore.setCarriagePos({
      lineIndex: coords.lineIndex,
      indexInLine: coords.indexInLine,
    })

    this.editorStore.setFocus(true)
    this.element.addEventListener('mousemove', this.mouseMoveEvent)
  }

  private updateSelection(evt: MouseEvent) {
    if ((evt.target as HTMLElement).id === 'carriage') return

    const coords = getCoords(evt.target as HTMLElement)

    const finish = {
      indexInLine: coords.indexInLine !== 0 ? coords.indexInLine - 1 : 0,
      lineIndex: coords.lineIndex,
    }
    const startLineIndex = Number(
      this.editorStore.selectionRange.start?.lineIndex
    )
    const startIndexInLine = Number(
      this.editorStore.selectionRange.start?.indexInLine
    )

    if (
      finish.lineIndex < startLineIndex ||
      (finish.lineIndex === startLineIndex &&
        finish.indexInLine <= startIndexInLine)
    ) {
      finish.indexInLine =
        finish.indexInLine - 1 < 0 ? 0 : finish.indexInLine - 1
    }

    this.editorStore.changeSelectionRange({
      finish,
    })

    this.editorStore.setCarriagePos({
      lineIndex: coords.lineIndex,
      indexInLine: coords.indexInLine,
    })
  }

  private endSelection() {
    this.element.removeEventListener('mousemove', this.mouseMoveEvent)
  }
}
