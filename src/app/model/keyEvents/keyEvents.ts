import { getClosestLine, getClosestSymbol } from '../../lib/getElements.helpers'
import { useEditorStore } from '@/entities/editor-store/editorStore'
import { IPosition } from '@/entities/editor-store/editorStore.types'
import { lineAttr, symbolAttr } from '@/shared/utils/lib/elements.const'
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

  private copyToClipboard() {
    const range: { start: IPosition; finish: IPosition } = {
      start: { line: 0, indexInLine: 0 },
      finish: { line: editorStore.lines.length - 1, indexInLine: -1 },
    }

    const selection = window.getSelection()

    const startNode = selection?.anchorNode?.parentElement
    const finishNode = selection?.focusNode?.parentElement

    if (!startNode || !finishNode) {
      // eslint-disable-next-line no-console
      console.warn('start or finish nodes are not exist')
      return range
    }
    const indexes = [
      getClosestLine(startNode)?.getAttribute(lineAttr),
      getClosestSymbol(startNode)?.getAttribute(symbolAttr),
      getClosestLine(finishNode)?.getAttribute(lineAttr),
      getClosestSymbol(finishNode)?.getAttribute(symbolAttr),
    ]

    if (indexes.every((index) => index !== undefined || index !== null)) {
      //@ts-expect-error INTENTIONAL
      range.start.line = +indexes[0]
      //@ts-expect-error INTENTIONAL
      range.start.indexInLine = +indexes[1]
      //@ts-expect-error INTENTIONAL
      range.finish.line = +indexes[2]
      //@ts-expect-error INTENTIONAL
      range.finish.indexInLine = +indexes[3]
    }
    const text = editorStore.getText(range.start, range.finish)
    navigator.clipboard.writeText(text)
  }

  private startSelection(evt: MouseEvent) {}

  private updateSelection(evt: MouseEvent) {}

  private endSelection(evt: MouseEvent) {}

  private onKeyDown(evt: KeyboardEvent) {
    evt.preventDefault()
    if (evt.key.length === 1) {
      if (evt.ctrlKey) {
        if (evt.code === 'KeyC') {
          this.copyToClipboard()
        }
        return
      }
      editorStore.addNewSymbol({ value: evt.key })
    } else if (evt.key === 'Tab') {
      editorStore.addNewSymbol({ value: ' ' })
      editorStore.addNewSymbol({ value: ' ' })
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
