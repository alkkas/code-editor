import { useEditorStore } from '@/entities/editor-store/model/editorStore'
import { EventMap } from '@/shared/utils/types/types'
import { SelectionEvents } from './Selection.events'

const editorStore = useEditorStore.getState()

export class KeyEvents {
  wrapper: HTMLDivElement

  private additionalEvents: Record<string, EventMap> = {
    selection: new SelectionEvents().events,
  }

  getAdditionalEvents() {
    return Object.keys(this.additionalEvents).reduce<EventMap>((acc, curr) => {
      const events = this.additionalEvents[curr]
      acc = Object.assign(acc, events)
      return acc
    }, {})
  }

  private events: EventMap = {
    focus: this.onFocus.bind(this),
    focusout: this.onFocusout.bind(this),
    keydown: this.onKeyDown.bind(this),
    ...this.getAdditionalEvents(),
  }

  constructor(wrapper: HTMLDivElement) {
    this.wrapper = wrapper
  }

  private onFocus() {
    editorStore.setFocus(true)
  }
  private onFocusout() {
    editorStore.setFocus(false)
  }

  private onKeyDown(evt: KeyboardEvent) {
    evt.preventDefault()
    if (evt.key.length === 1) {
      if (evt.ctrlKey) {
        if (evt.code === 'KeyC') {
          editorStore.copyToClipboard(editorStore.getSelectionRange())
        } else if (evt.code === 'KeyX') {
          editorStore.cut()
        }
        return
      }
      editorStore.addNewSymbol({ value: evt.key })
    } else if (evt.key === 'Tab') {
      editorStore.addNewSymbol({ value: ' ' }, { value: ' ' })
    } else if (evt.key === 'Backspace') {
      editorStore.deleteSymbol()
    } else if (evt.key === 'ArrowLeft') {
      editorStore.moveCarriage('left')
    } else if (evt.key === 'ArrowRight') {
      editorStore.moveCarriage('right')
    } else if (evt.key === 'ArrowUp') {
      editorStore.moveCarriage('up')
    } else if (evt.key === 'ArrowDown') {
      editorStore.moveCarriage('down')
    } else if (evt.key === 'Enter') {
      editorStore.createNewLine()
    }
  }

  createAllListeners() {
    const eventsKeys = Object.keys(this.events) as Array<
      keyof HTMLElementEventMap
    >

    eventsKeys.forEach((eventKey) => {
      const listener = this.events[eventKey] as (evt: Event) => void
      if (!listener) throw Error(`No such event ${eventKey}`)
      this.wrapper.addEventListener(eventKey, listener)
    })
  }

  deleteAllListeners() {
    const eventsKeys = Object.keys(this.events) as Array<
      keyof HTMLElementEventMap
    >

    eventsKeys.forEach((eventKey) => {
      const listener = this.events[eventKey] as (evt: Event) => void
      if (!listener) throw Error(`No such event ${eventKey}`)
      this.wrapper.removeEventListener(eventKey, listener)
    })
  }
}
