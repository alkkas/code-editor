import { useEditorStore } from '@/store/editorStore'
import { EventMap } from '@/utils/types/types'
import { GetEventsFunc } from './events.model'

export const getDefaultEvents: GetEventsFunc = () => {
  const editorStore = useEditorStore.getState()

  const events: EventMap = {
    focus() {
      editorStore.setFocus(false)
    },
    focusout() {
      editorStore.setFocus(false)
    },
    async keydown(evt: KeyboardEvent) {
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
    },
    paste(e: ClipboardEvent) {
      if (!useEditorStore.getState().isFocused) return

      const text = e.clipboardData?.getData('Text')

      if (!text) return

      editorStore.pasteText(text)
    },
  }

  return { events }
}
