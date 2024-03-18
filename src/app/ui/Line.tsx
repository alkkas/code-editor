import LineNumber from '@/shared/LineNumber/LineNumber'
import { ISymbol } from '@/entities/editor-store/editorStore.types'
import { memo } from 'react'
import { useEditorStore } from '@/entities/editor-store/editorStore'

interface LineProps {
  line: ISymbol[]
  index: number
}

const Line = memo(
  function Line(props: LineProps) {
    return (
      <div key={props.index} className="flex items-stretch">
        <LineNumber count={props.index + 1} />
        <div data-line-index={props.index} className="flex items-center w-full">
          {props.line.map((symbol, symbol_idx) => (
            <span key={symbol_idx} data-symbol-index={symbol_idx}>
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
    return editorStore.currentCarriagePos.line !== nextProps.index
  }
)
export default Line
