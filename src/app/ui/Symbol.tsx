interface SymolProps {
  symbol_idx: number
  attrs: Record<string, any>
}

export const Symbol = (props: SymbolProps) => {
  return (
    <span
      key={symbol_idx}
      {...{ [symbolAttr]: symbol_idx }}
      style={{ color: symbol.color ?? 'black' }}
      className={symbolBorder(props.index, symbol_idx)}
    >
      {symbol.value === ' ' ? <>&nbsp;</> : symbol.value}
    </span>
  )
}
