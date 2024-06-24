import { EventMap } from '@/shared/utils/types/types'
import { getCoords } from '../../lib/getElements.helpers'
import { EventBase } from './Event.base'
import { useEditorStore } from '@/store/editorStore'

export class SelectionEvents implements EventBase {
  events: EventMap = {
    mousedown: this.startSelection.bind(this),
    mousemove: this.updateSelection.bind(this),
    mouseup: this.endSelection.bind(this),
  }

  editorStore = useEditorStore.getState()
  isSelecting = false

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
    this.isSelecting = true
  }

  private updateSelection(evt: MouseEvent) {
    if (!this.isSelecting || (evt.target as HTMLElement).id === 'carriage')
      return

    const coords = getCoords(evt.target as HTMLElement)

    this.editorStore.changeSelectionRange({
      finish: {
        indexInLine: coords.indexInLine !== 0 ? coords.indexInLine - 1 : 0,
        lineIndex: coords.lineIndex,
      },
    })

    this.editorStore.setCarriagePos({
      lineIndex: coords.lineIndex,
      indexInLine: coords.indexInLine,
    })
  }

  private endSelection() {
    this.isSelecting = false
  }
}
