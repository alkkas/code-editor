import { symbolAttr } from '@/shared/utils/lib/elements.const'
import { useEditorStore } from '@/store/editorStore'
import { ISymbol } from '@/store/editorStore.types'

interface SymbolProps {
  symbolIdx: number
  lineIdx: number
  symbol: ISymbol
}

const Symbol = (props: SymbolProps) => {
  const editorStore = useEditorStore()

  const symbolBorder = (lineIndex: number, symbolIndex: number) => {
    let symbolClassName = ''

    if (!editorStore.isSelectionActive()) return symbolClassName

    const { start, finish } = editorStore.getSelectionRange()

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
        (lineIndex === start.lineIndex && symbolIndex === start.indexInLine) ||
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
    <span
      key={props.symbolIdx}
      {...{ [symbolAttr]: props.symbolIdx }}
      style={{ color: props.symbol.color ?? 'black' }}
      className={symbolBorder(props.lineIdx, props.symbolIdx)}
    >
      {props.symbol.value === ' ' ? <>&nbsp;</> : props.symbol.value}
    </span>
  )
}

export default Symbol
