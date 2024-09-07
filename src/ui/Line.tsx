import LineNumber from './LineNumber'
import { ISymbol } from '@/store/editorStore.types'
import { useContext } from 'react'
import { lineAttr } from '@/utils/lib/elements.const'
import Symbol from './Symbol'
import { EditorClassNamesContext } from './classNames.context'

interface LineProps {
  line: ISymbol[]
  index: number
}

const Line = (props: LineProps) => {
  const classNamesContext = useContext(EditorClassNamesContext)

  return (
    <div
      key={props.index}
      className={`flex text-lg items-stretch ${classNamesContext.lineClassName ?? ''}`}
    >
      <LineNumber count={props.index + 1} lineIndex={props.index} />
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
