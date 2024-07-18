import { useLayoutEffect, useRef, useState } from 'react'
import { KeyEvents } from '../model/events/KeyEvents'
import { EditorProps } from '../model/editor-types'
import { Carriage } from '@/shared/ui/Carriage/Carriage'
import { useEditorStore } from '@/store/editorStore'
import Line from './Line'
import { lineElement, symbolElement } from '../lib/getElements.helpers'
import '../index.css'

const DEFAULT_FONT_SIZE = 16

export default function Editor(props: EditorProps) {
  const wrapper = useRef<HTMLDivElement>(null)
  const fontSize = props.fontSize ?? DEFAULT_FONT_SIZE
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
      (line.offsetTop ?? 0) + (line.clientHeight / 2 - fontSize / 2)
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
    //TODO: run this in worker
    updateCarriageCoords()
    editorStore.highlightSyntax(props.theme.language, props.theme.editorText)
  }, [editorStore.getCurrentLineIndex(), editorStore.getCurrentIndexInLine()])

  useLayoutEffect(() => {
    if (!wrapper.current) throw new Error('wrapper component is null')

    const keyEvents = new KeyEvents(wrapper.current)

    keyEvents.createAllListeners()

    return keyEvents.deleteAllListeners.bind(keyEvents)
  }, [])

  return (
    <div
      {...props}
      style={{ ...props.style, width: props.width, height: props.height }}
      ref={wrapper}
      className="bg-secondary border-primary border cursor-text select-none relative overflow-auto"
      tabIndex={0}
    >
      {editorStore.isFocused && (
        <Carriage
          fontSize={fontSize}
          left={carriageCoords.x}
          top={carriageCoords.y}
        />
      )}
      <div className="relative">
        {/* 
          put nothing else here except of lines 
          because foreign elements will cause wrong selection
        */}
        {editorStore.lines.map((line, line_idx) => (
          <Line line={line} index={line_idx} key={line_idx} />
        ))}
      </div>
    </div>
  )
}
