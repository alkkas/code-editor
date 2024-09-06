import LineNumber from './LineNumber'
import { ISymbol } from '@/store/editorStore.types'
import { memo, useContext } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { lineAttr } from '@/utils/lib/elements.const'
import Symbol from './Symbol'
import { EditorClassNamesContext } from './classNames.context'

interface LineProps {
  line: ISymbol[]
  index: number
}

const isCursorInCurrLine = (lineProps: LineProps) => {
  const editorStore = useEditorStore.getState()

  const range = editorStore.selectionRange

  if (lineProps.index === range.finish?.lineIndex) {
    return true
  }
  return false
}

const areLinesEqual = (linePrev: LineProps, lineCurr: LineProps) => {
  if (linePrev.index !== lineCurr.index) return false

  if (linePrev.line.length !== lineCurr.line.length) return false

  if (isCursorInCurrLine(lineCurr)) return false

  return true
}

const Line = (props: LineProps) => {
  const classNamesContext = useContext(EditorClassNamesContext)

  return (
    <div
      key={props.index}
      className={`flex text-lg items-stretch ${classNamesContext.lineClassName ?? ''}`}
    >
      <LineNumber count={props.index + 1} />
      <div
        {...{ [lineAttr]: props.index }}
        className="flex items-center w-full"
      >
        {props.line.map((symbol, symbolIdx) => (
          <Symbol
            lineIdx={props.index}
            symbol={symbol}
            symbolIdx={symbolIdx}
            key={`${props.index}-${symbolIdx}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Line
