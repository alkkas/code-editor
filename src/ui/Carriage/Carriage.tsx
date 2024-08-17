import { useContext, useLayoutEffect, useRef } from 'react'
import { EditorClassNamesContext } from '../classNames.context'
import { lineElement } from '@/utils/lib/getElements.helpers'
import './carriage.css'
interface CarriageProps {
  left: number
  top: number
}

const CARRIAGE_WIDTH_COEFFICIENT = 0.092

export const Carriage = ({ top, left }: CarriageProps) => {
  const classNamesContext = useContext(EditorClassNamesContext)

  const carriageRef = useRef<null | HTMLDivElement>(null)

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
        top,
        left,
      }}
      className={`animate-blink bg-primary absolute z-50 carriage ${classNamesContext.carriageClassName ?? ''}`}
    />
  )
}
