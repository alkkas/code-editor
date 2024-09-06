import { useLayoutEffect, useRef, useEffect } from 'react'
import { Events } from '@/model/events/events'
import { EditorProps } from '@/model/editor-types'
import { Carriage } from '../Carriage/Carriage'
import { useEditorStore } from '@/store/editorStore'
import Line from '../Line'
import { EditorClassNamesContext } from '../classNames.context'
import './index.css'

export default function Editor(props: EditorProps) {
  const wrapper = useRef<HTMLDivElement>(null)
  const editorStore = useEditorStore()

  useLayoutEffect(() => {
    if (!wrapper.current) throw new Error('wrapper component is null')

    const events = new Events(wrapper.current)

    events.createAllListeners()

    return events.deleteAllListeners.bind(events)
  }, [])

  useLayoutEffect(() => {
    editorStore.setLanguage(props.language)

    if (props.theme?.editorText)
      editorStore.setTextTheme(props.theme.editorText)
  }, [props.language, props.theme?.editorText])

  useEffect(() => {
    if (!props.initialValue) return
    editorStore.pasteText(props.initialValue)
    editorStore.setCarriagePos({ lineIndex: 0, indexInLine: 0 })
  }, [props.initialValue])

  useLayoutEffect(() => {
    // editorStore.highlightSyntax()
  }, [editorStore.getCurrentLineIndex(), editorStore.getCurrentIndexInLine()])

  return (
    <div
      data-testid="editor"
      style={{ ...props.style }}
      ref={wrapper}
      className={`bg-secondary border-primary border cursor-text
         select-none relative overflow-auto ${props.wrapperClassName ?? ''}`}
      tabIndex={0}
    >
      <EditorClassNamesContext.Provider value={props}>
        {editorStore.isFocused && <Carriage />}
        <div className="relative">
          {editorStore.lines.map((line, line_idx) => (
            <Line line={line} index={line_idx} key={line_idx} />
          ))}
        </div>
      </EditorClassNamesContext.Provider>
    </div>
  )
}
