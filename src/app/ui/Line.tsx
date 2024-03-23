import LineNumber from '@/shared/LineNumber/LineNumber'
import { ISymbol } from '@/entities/editor-store/editorStore.types'
import { memo } from 'react'
import { useEditorStore } from '@/entities/editor-store/editorStore'
import { lineAttr, symbolAttr } from '@/shared/utils/lib/elements.const'

interface LineProps {
  line: ISymbol[]
  index: number
}

const areLinesEqual = (line1: ISymbol[], line2: ISymbol[]) => {
  if (line1.length !== line2.length) return false

  for (let i = 0; i < line1.length; i++) {
    if (
      line1[i].value !== line2[i].value ||
      line1[i].color !== line2[i].color
    ) {
      return false
    }
  }
  return true
}

const Line = memo(
  function Line(props: LineProps) {
    return (
      <div key={props.index} className="flex items-stretch">
        <LineNumber count={props.index + 1} />
        <div
          {...{ [lineAttr]: props.index }}
          className="flex items-center w-full"
        >
          {props.line.map((symbol, symbol_idx) => (
            <span key={symbol_idx} {...{ [symbolAttr]: symbol_idx }}>
              {symbol.value === ' ' ? <>&nbsp;</> : symbol.value}
            </span>
          ))}
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    const editorStore = useEditorStore.getState()

    if (prevProps.index !== nextProps.index) return false

    return (
      editorStore.currentCarriagePos.line !== nextProps.index &&
      areLinesEqual(prevProps.line, nextProps.line)
    )
  }
)
export default Line
