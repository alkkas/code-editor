import { MouseEvent, useLayoutEffect, useRef, useState } from 'react'
import { KeyEvents } from './model/keyEvents/keyEvents'
import { EditorProps } from './model/editor-types'
import { Carriage } from '@/shared/Carriage/Carriage'
import { useEditorStore } from '@/entities/editor-store/editorStore'
import LineNumber from '@/shared/LineNumber/LineNumber'
import './index.css'

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
    initialCoords.y = (line.offsetTop ?? 0) + 8
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

  const clickOnEditor = (evt: MouseEvent<HTMLDivElement>) => {
    const target = evt.target as HTMLElement

    const line = target.closest(`div[data-line-index]`)
    let lineIndex = Number(line?.getAttribute('data-line-index'))
    lineIndex = isNaN(lineIndex) ? 0 : lineIndex

    const symbol = target.closest(`span[data-symbol-index]`)
    let indexInLine = Number(symbol?.getAttribute('data-symbol-index'))
    indexInLine = isNaN(indexInLine) ? 0 : indexInLine

    editorStore.setCarriagePos({ line: lineIndex, indexInLine })
  }

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
      className="bg-secondary border-primary border cursor-text relative"
      tabIndex={0}
    >
      <div className="relative overflow-scroll" onClick={clickOnEditor}>
        {editorStore.isFocused && (
          <Carriage
            fontSize={fontSize}
            left={carriageCoords.x}
            top={carriageCoords.y}
          />
        )}

        {editorStore.lines.map((line, line_idx) => (
          <div key={line_idx} className="flex items-stretch">
            <LineNumber count={line_idx + 1} />
            <div data-line-index={line_idx} className="flex items-center">
              {line.map((symbol, symbol_idx) => (
                <span key={symbol_idx} data-symbol-index={symbol_idx}>
                  {symbol.value === ' ' ? <>&nbsp;</> : symbol.value}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
