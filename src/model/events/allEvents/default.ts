import { useEditorStore } from '@/store/editorStore'
import { EventMap } from '@/utils/types/types'
import { GetEventsFunc } from './events.model'

export const getDefaultEvents: GetEventsFunc = () => {
  const editorStore = useEditorStore.getState()

  const keyToEventMap: Record<string, () => void> = {
    Tab: () => editorStore.addNewSymbol({ value: ' ' }, { value: ' ' }),
    Backspace: () => editorStore.deleteSymbol(),
    ArrowLeft: () => editorStore.moveCarriage('left'),
    ArrowRight: () => editorStore.moveCarriage('right'),
    ArrowUp: () => editorStore.moveCarriage('up'),
    ArrowDown: () => editorStore.moveCarriage('down'),
    Enter: () => editorStore.createNewLine(),
  }

  const ctrlKeyToEventMap: Record<string, () => Promise<void> | void> = {
    KeyC: () => editorStore.copyToClipboard(editorStore.getSelectionRange()),
    KeyX: () => editorStore.cut(),
    KeyV: async () =>
      editorStore.pasteText(await navigator.clipboard.readText()),
  }

  const events: EventMap = {
    focus() {
      editorStore.setFocus(true)
    },
    focusout() {
      editorStore.setFocus(false)
    },
    async keydown(evt: KeyboardEvent) {
      evt.preventDefault()

      keyToEventMap[evt.key]?.()

      if (evt.key.length !== 1) return

      if (!evt.ctrlKey) {
        editorStore.addNewSymbol({ value: evt.key })
        return
      }

      await ctrlKeyToEventMap[evt.code]?.()
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
