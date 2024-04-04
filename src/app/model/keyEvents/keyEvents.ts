import { useEditorStore } from '@/entities/editor-store/model/editorStore'
import { TransformEventMap } from '@/shared/utils/types/types'

const editorStore = useEditorStore.getState()

export class KeyEvents {
  wrapper: HTMLDivElement

  constructor(wrapper: HTMLDivElement) {
    this.wrapper = wrapper
  }

  private onFocus() {
    editorStore.setFocus(true)
  }
  private onFocusout() {
    editorStore.setFocus(false)
  }

  private startSelection(evt: MouseEvent) {}

  private updateSelection(evt: MouseEvent) {}

  private endSelection(evt: MouseEvent) {}

  private onKeyDown(evt: KeyboardEvent) {
    evt.preventDefault()
    if (evt.key.length === 1) {
      if (evt.ctrlKey) {
        if (evt.code === 'KeyC') {
          //skip
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

  private events: Partial<TransformEventMap<HTMLElementEventMap>> = {
    focus: this.onFocus.bind(this),
    focusout: this.onFocusout.bind(this),
    keydown: this.onKeyDown.bind(this),
    mousedown: this.startSelection.bind(this),
    mousemove: this.updateSelection.bind(this),
    mouseup: this.endSelection.bind(this),
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
