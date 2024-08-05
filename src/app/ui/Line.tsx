import LineNumber from '@/shared/ui/LineNumber/LineNumber'
import { ISymbol } from '@/store/editorStore.types'
import { memo } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { lineAttr } from '@/shared/utils/lib/elements.const'
import Symbol from './Symbol'

interface LineProps {
  line: ISymbol[]
  index: number
}

const areLineInRange = (lineProps: LineProps) => {
  const editorStore = useEditorStore.getState()
  try {
    const range = editorStore.getSelectionRange()

    if (
      lineProps.index >= range.start.lineIndex &&
      lineProps.index <= range.finish.lineIndex
    ) {
      return true
    }
  } catch (e) {
    return false
  }
}

const areLinesEqual = (linePrev: LineProps, lineCurr: LineProps) => {
  if (linePrev.index !== lineCurr.index) return false

  if (linePrev.line.length !== lineCurr.line.length) return false

  if (areLineInRange(linePrev) !== areLineInRange(lineCurr)) return false

  return true
}

const Line = (props: LineProps) => {
  return (
    <div key={props.index} className="flex items-stretch">
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
