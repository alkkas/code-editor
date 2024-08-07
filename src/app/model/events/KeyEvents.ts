import { useEditorStore } from '@/store/editorStore'
import { EventMap } from '@/shared/utils/types/types'
import { SelectionEvents } from './Selection.events'

const editorStore = useEditorStore.getState()

export class KeyEvents {
  wrapper: HTMLDivElement

  private readonly additionalEvents: Record<string, EventMap>

  private readonly events: EventMap

  constructor(wrapper: HTMLDivElement) {
    this.wrapper = wrapper
    this.additionalEvents = {
      selection: new SelectionEvents(this.wrapper).events,
    }
    this.events = {
      focus: this.onFocus.bind(this),
      focusout: this.onFocusout.bind(this),
      keydown: this.onKeyDown.bind(this),
      ...this.getAdditionalEvents(),
    }
  }

  getAdditionalEvents() {
    return Object.keys(this.additionalEvents).reduce<EventMap>((acc, curr) => {
      const events = this.additionalEvents[curr]
      acc = Object.assign(acc, events)
      return acc
    }, {})
  }

  private onFocus() {
    editorStore.setFocus(true)
  }
  private onFocusout() {
    editorStore.setFocus(false)
  }

  private paste(e: ClipboardEvent) {
    if (!useEditorStore.getState().isFocused) return

    const text = e.clipboardData?.getData('Text')
    if (!text) return

    editorStore.pasteText(text)
  }

  private async onKeyDown(evt: KeyboardEvent) {
    evt.preventDefault()
    if (evt.key.length === 1) {
      if (evt.ctrlKey) {
        if (evt.code === 'KeyC') {
          editorStore.copyToClipboard(editorStore.getSelectionRange())
        } else if (evt.code === 'KeyX') {
          editorStore.cut()
        } else if (evt.code === 'KeyV') {
          const text = await navigator.clipboard.readText()
          editorStore.pasteText(text)
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
    document.addEventListener('paste', this.paste)
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
    document.removeEventListener('paste', this.paste)
  }
}
