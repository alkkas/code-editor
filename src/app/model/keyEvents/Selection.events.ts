import { EventMap } from '@/shared/utils/types/types'
import { getCoords } from '../../lib/getElements.helpers'
import { EventBase } from './Event.base'

export class SelectionEvents implements EventBase {
  events: EventMap = {
    mousedown: this.startSelection.bind(this),
    mousemove: this.updateSelection.bind(this),
    mouseup: this.endSelection.bind(this),
  }

  isSelecting = false

  private startSelection(evt: MouseEvent) {
    if (!evt.target) return

    const coords = getCoords(evt.target as HTMLElement)
  }

  private updateSelection(evt: MouseEvent) {}

  private endSelection(evt: MouseEvent) {
    this.isSelecting = false
  }
}
