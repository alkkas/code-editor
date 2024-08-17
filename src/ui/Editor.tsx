import { useLayoutEffect, useRef, useState } from 'react'
import { Events } from '../model/events/events'
import { EditorProps } from '../model/editor-types'
import { Carriage } from './Carriage/Carriage'
import { useEditorStore } from '@/store/editorStore'
import Line from './Line'
import { lineElement, symbolElement } from '@/utils/lib/getElements.helpers'
import '../index.css'
import { EditorClassNamesContext } from './classNames.context'

export default function Editor(props: EditorProps) {
  const wrapper = useRef<HTMLDivElement>(null)
  const editorStore = useEditorStore()

  const [carriageCoords, setCarriageCoords] = useState({ x: 0, y: 0 })
  const updateCarriageCoords = () => {
    const { index, indexInLine } = editorStore.getCurrent()
    const initialCoords = { x: 0, y: 0 }

    const line = document.querySelector(
      lineElement(index)
    ) as HTMLDivElement | null

    if (!line) throw Error('Line not found')

    initialCoords.y =
      (line.offsetTop ?? 0) + (line.clientHeight / 2 - line.offsetHeight / 2)
    initialCoords.x = line.offsetLeft

    const symbols = document.querySelectorAll(
      `${lineElement(index)} ${symbolElement()}`
    ) as NodeListOf<HTMLSpanElement> | null

    if (indexInLine === 0) {
      setCarriageCoords(initialCoords)
      return
    } else if (!symbols?.length) {
      throw Error(`No symbols found in line: ${index}`)
    } else if (indexInLine === symbols?.length) {
      const lastSymbol = symbols.item(symbols.length - 1)
      initialCoords.x = lastSymbol.offsetLeft + lastSymbol.offsetWidth
    } else {
      const symbol = symbols?.item(indexInLine)
      if (!symbol) throw Error(`Symbol not found in position: ${indexInLine}`)

      initialCoords.x = symbol.offsetLeft
    }

    setCarriageCoords(initialCoords)
  }

  useLayoutEffect(() => {
    editorStore.highlighter.language = props.language

    if (props.theme.editorText)
      editorStore.highlighter.editorText = props.theme.editorText
  }, [props.language, props.theme.editorText])

  useLayoutEffect(() => {
    updateCarriageCoords()
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
        {editorStore.isFocused && (
          <Carriage left={carriageCoords.x} top={carriageCoords.y} />
        )}
        <div className="relative">
          {editorStore.lines.map((line, line_idx) => (
            <Line line={line} index={line_idx} key={line_idx} />
          ))}
        </div>
      </EditorClassNamesContext.Provider>
    </div>
  )
}
