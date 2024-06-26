import LineNumber from '@/shared/ui/LineNumber/LineNumber'
import { ISymbol } from '@/store/editorStore.types'
import { memo } from 'react'
import { useEditorStore } from '@/store/editorStore'
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
    const editorStore = useEditorStore()

    const symbolBorder = (lineIndex: number, symbolIndex: number) => {
      let symbolClassName = ''

      if (!editorStore.isSelectionActive()) return symbolClassName

      const { start, finish } = editorStore.getSelectionRange()
      //TODO: fix bugs
      if (
        lineIndex >= start.lineIndex &&
        lineIndex <= finish.lineIndex &&
        (lineIndex === start.lineIndex
          ? symbolIndex >= start.indexInLine
          : true) &&
        (lineIndex === finish.lineIndex
          ? symbolIndex <= finish.indexInLine
          : true)
      ) {
        symbolClassName += 'bg-slate-400'

        if (
          (lineIndex === start.lineIndex &&
            symbolIndex === start.indexInLine) ||
          symbolIndex === 0
        ) {
          symbolClassName += ' rounded-l-md'
        }

        if (
          (lineIndex === finish.lineIndex &&
            symbolIndex === finish.indexInLine) ||
          symbolIndex === editorStore.lines[lineIndex].length - 1
        ) {
          symbolClassName += ' rounded-r-md'
        }
      }

      return symbolClassName
    }

    return (
      <div key={props.index} className="flex items-stretch">
        <LineNumber count={props.index + 1} />
        <div
          {...{ [lineAttr]: props.index }}
          className="flex items-center w-full"
        >
          {props.line.map((symbol, symbol_idx) => (
            <span
              key={symbol_idx}
              {...{ [symbolAttr]: symbol_idx }}
              style={{ color: symbol.color ?? 'black' }}
              className={symbolBorder(props.index, symbol_idx)}
            >
              {symbol.value === ' ' ? <>&nbsp;</> : symbol.value}
            </span>
          ))}
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    //TODO: fix memoization
    return false
    const editorStore = useEditorStore.getState()

    if (prevProps.index !== nextProps.index) return false

    return (
      editorStore.currentCarriagePos.lineIndex !== nextProps.index &&
      areLinesEqual(prevProps.line, nextProps.line)
    )
  }
)
export default Line
