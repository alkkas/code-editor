import { useContext, useLayoutEffect, useRef, useState } from 'react'
import { EditorClassNamesContext } from '../classNames.context'
import { lineElement, symbolElement } from '@/utils/lib/getElements.helpers'
import './carriage.css'
import { useEditorStore } from '@/store/editorStore'

const CARRIAGE_WIDTH_COEFFICIENT = 0.05

export const Carriage = () => {
  const classNamesContext = useContext(EditorClassNamesContext)
  const editorStore = useEditorStore()

  const carriageRef = useRef<null | HTMLDivElement>(null)

  const [carriageCoords, setCarriageCoords] = useState({ x: 0, y: 0 })

  const updateCarriageCoords = () => {
    const { index, indexInLine } = editorStore.getCurrent()
    const initialCoords = { x: 0, y: 0 }

    const line = document.querySelector(
      lineElement(index)
    ) as HTMLDivElement | null

    if (!line) throw Error('Line not found')

    const carriageWidth = carriageRef.current?.offsetWidth ?? 0

    initialCoords.y =
      line.offsetTop + (line.clientHeight / 2 - line.offsetHeight / 2)
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
    initialCoords.x -= carriageWidth / 2
    setCarriageCoords(initialCoords)
  }

  useLayoutEffect(() => {
    updateCarriageCoords()
  }, [editorStore.getCurrentLineIndex(), editorStore.getCurrentIndexInLine()])

  useLayoutEffect(() => {
    const line = document.querySelector(lineElement()) as HTMLDivElement | null
    if (!line) return

    const lineHeight = line.offsetHeight
    const lineWidth = lineHeight * CARRIAGE_WIDTH_COEFFICIENT

    if (!carriageRef.current) return

    carriageRef.current.style.setProperty('--carriage-width', `${lineWidth}px`)
    carriageRef.current.style.setProperty(
      '--carriage-height',
      `${lineHeight}px`
    )
  }, [classNamesContext.lineClassName, carriageRef.current])

  return (
    <div
      ref={carriageRef}
      id="carriage"
      style={{
        top: carriageCoords.y,
        left: carriageCoords.x,
      }}
      className={`animate-blink bg-primary absolute z-50 carriage ${classNamesContext.carriageClassName ?? ''}`}
    />
  )
}
