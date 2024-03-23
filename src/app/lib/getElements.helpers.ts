export const lineElement = (index?: number) => {
  const lineIndex = index !== undefined ? `="${index}"` : ''
  return `div[data-line-index${lineIndex}]` as const
}

export const symbolElement = (index?: number) => {
  const symbolIndex = index !== undefined ? `="${index}"` : ''
  return `span[data-symbol-index${symbolIndex}]` as const
}

export const getClosestLine = (target: HTMLElement) => {
  return target.closest(lineElement())
}

export const getClosestSymbol = (target: HTMLElement) => {
  return target.closest(symbolElement())
}
