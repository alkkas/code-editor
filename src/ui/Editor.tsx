import { useLayoutEffect, useRef } from 'react'
import { Events } from '@/model/events/events'
import { EditorProps } from '@/model/editor-types'
import { Carriage } from './Carriage/Carriage'
import { useEditorStore } from '@/store/editorStore'
import Line from './Line'
import { EditorClassNamesContext } from './classNames.context'

export default function Editor(props: EditorProps) {
  const wrapper = useRef<HTMLDivElement>(null)
  const editorStore = useEditorStore()

  useLayoutEffect(() => {
    editorStore.highlighter.language = props.language

    if (props.theme?.editorText)
      editorStore.highlighter.editorText = props.theme.editorText
  }, [props.language, props.theme?.editorText])

  useLayoutEffect(() => {
    editorStore.highlightSyntax()
  }, [editorStore.getCurrentLineIndex(), editorStore.getCurrentIndexInLine()])

  useLayoutEffect(() => {
    if (!wrapper.current) throw new Error('wrapper component is null')

    const events = new Events(wrapper.current)

    events.createAllListeners()

    return events.deleteAllListeners.bind(events)
  }, [])

  return (
    <div
      {...props}
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
