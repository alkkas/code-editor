interface SymolProps<T extends any> {
  symbol_idx: number
  attrs: Record<string, T>
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
