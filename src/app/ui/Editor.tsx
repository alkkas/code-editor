import { MouseEvent, useLayoutEffect, useRef, useState } from 'react'
import { KeyEvents } from '../model/keyEvents/keyEvents'
import { EditorProps } from '../model/editor-types'
import { Carriage } from '@/shared/Carriage/Carriage'
import { useEditorStore } from '@/entities/editor-store/editorStore'
import LineNumber from '@/shared/LineNumber/LineNumber'
import '../index.css'
import Line from '@/app/ui/Line'

export default function Editor(props: EditorProps) {
  const wrapper = useRef<HTMLDivElement>(null)
  const fontSize = props.fontSize ?? 16
  const editorStore = useEditorStore()

  const [carriageCoords, setCarriageCoords] = useState({ x: 0, y: 0 })

  const updateCarriageCoords = () => {
    const { index, indexInLine } = editorStore.getCurrent()
    const initialCoords = { x: 0, y: 0 }

    const line = document.querySelector(
      `div[data-line-index="${index}"]`
    ) as HTMLDivElement | null

    if (!line) throw Error('Line not found')

    //TODO: change this
    initialCoords.y = (line.offsetTop ?? 0) + 9
    initialCoords.x = line.offsetLeft

    const symbols = document.querySelectorAll(
      `div[data-line-index="${index}"] span[data-symbol-index]`
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

  useLayoutEffect(updateCarriageCoords, [
    editorStore.getCurrentLineIndex(),
    editorStore.getCurrentIndexInLine(),
  ])

  useLayoutEffect(() => {
    if (!wrapper.current) throw new Error('wrapper component is null')

    const keyEvents = new KeyEvents(wrapper.current)

    keyEvents.createAllListeners()

    return keyEvents.deleteAllListeners.bind(keyEvents)
  }, [])

  const clickOnEditor = (evt: MouseEvent<HTMLDivElement>) => {
    editorStore.setFocus(false)
    const target = evt.target as HTMLElement
    const line = target.closest(`div[data-line-index]`)
    let lineIndex = Number(line?.getAttribute('data-line-index'))

    lineIndex = isNaN(lineIndex) ? editorStore.lines.length - 1 : lineIndex

    const symbol = target.closest(`span[data-symbol-index]`)
    let indexInLine = Number(symbol?.getAttribute('data-symbol-index'))
    indexInLine = isNaN(indexInLine)
      ? editorStore.lines[lineIndex].length
      : indexInLine

    editorStore.setCarriagePos({ line: lineIndex, indexInLine })
    editorStore.setFocus(true)
  }

  return (
    <div
      {...props}
      style={{ ...props.style, width: props.width, height: props.height }}
      ref={wrapper}
      className="bg-secondary border-primary border cursor-text relative overflow-auto"
      tabIndex={0}
    >
      <div className="relative" onClick={clickOnEditor}>
        {editorStore.isFocused && (
          <Carriage
            fontSize={fontSize}
            left={carriageCoords.x}
            top={carriageCoords.y}
          />
        )}
        {editorStore.lines.map((line, line_idx) => (
          <Line line={line} index={line_idx} key={line_idx} />
        ))}
      </div>
    </div>
  )
}
