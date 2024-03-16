import { useEditorStore } from '@/entities/editor-store/editorStore'

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

  private onKeyDown(evt: KeyboardEvent) {
    if (evt.key.length === 1) {
      editorStore.addNewSymbol({ value: evt.key })
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

  private events: Partial<
    Record<
      keyof HTMLElementEventMap,
      (evt: HTMLElementEventMap[keyof HTMLElementEventMap]) => void
    >
  > = {
    focus: this.onFocus,
    focusout: this.onFocusout,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    keydown: this.onKeyDown,
  }

  createAllListeners() {
    Object.keys(this.events).forEach((eventKey) => {
      const listener = this.events[eventKey as keyof HTMLElementEventMap]
      if (!listener) throw Error(`No such event ${eventKey}`)
      this.wrapper.addEventListener(eventKey, listener)
    })
  }

  deleteAllListeners() {
    Object.keys(this.events).forEach((eventKey) => {
      const listener = this.events[eventKey as keyof HTMLElementEventMap]
      if (!listener) throw Error(`No such event ${eventKey}`)
      this.wrapper.removeEventListener(eventKey, listener)
    })
  }
}
