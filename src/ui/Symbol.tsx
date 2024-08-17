import { lineAttr, symbolAttr } from '@/utils/lib/elements.const'
import { useEditorStore } from '@/store/editorStore'
import { ISymbol } from '@/store/editorStore.types'

interface SymbolProps {
  symbolIdx: number
  lineIdx: number
  symbol: ISymbol
}

const valuesMapper: Record<string, JSX.Element> = {
  ' ': <>&nbsp;</>,
}

const getValueComponent = (value: string): JSX.Element => {
  const resolvedValue = valuesMapper[value]
  if (resolvedValue !== undefined) return resolvedValue
  return <>{value}</>
}

const Symbol = (props: SymbolProps) => {
  const editorStore = useEditorStore()

  const symbolBorder = (lineIndex: number, symbolIndex: number) => {
    let symbolClassName = ''
    if (!editorStore.isSelectionActive()) return ''

    const { start, finish } = editorStore.getSelectionRange()

    const symbolInRange =
      lineIndex >= start.lineIndex &&
      lineIndex <= finish.lineIndex &&
      (lineIndex === start.lineIndex
        ? symbolIndex >= start.indexInLine
        : true) &&
      (lineIndex === finish.lineIndex
        ? symbolIndex <= finish.indexInLine
        : true)

    if (symbolInRange) {
      symbolClassName += 'bg-slate-400'

      const selectionStartWithCurrentSymbol =
        (lineIndex === start.lineIndex && symbolIndex === start.indexInLine) ||
        symbolIndex === 0

      if (selectionStartWithCurrentSymbol) {
        symbolClassName += ' rounded-l-md'
      }

      const selectionEndsWithCurrentSymbol =
        (lineIndex === finish.lineIndex &&
          symbolIndex === finish.indexInLine) ||
        symbolIndex === editorStore.lines[lineIndex].length - 1

      if (selectionEndsWithCurrentSymbol) {
        symbolClassName += ' rounded-r-md'
      }
    }

    return symbolClassName
  }

  return (
    <span
      key={props.symbolIdx}
      {...{ [symbolAttr]: props.symbolIdx, [lineAttr]: props.lineIdx }}
      style={{ color: props.symbol.color ?? 'black' }}
      className={symbolBorder(props.lineIdx, props.symbolIdx)}
    >
      {getValueComponent(props.symbol.value)}
    </span>
  )
}

export default Symbol
