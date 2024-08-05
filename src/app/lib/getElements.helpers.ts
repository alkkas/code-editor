import { useEditorStore } from '@/store/editorStore'
import { lineAttr, symbolAttr } from '@/shared/utils/lib/elements.const'
import { IPosition } from '@/store/editorStore.types'

export const lineElement = (index?: number) => {
  const lineIndex = index !== undefined ? `="${index}"` : ''
  return `div[${lineAttr}${lineIndex}]` as const
}

export const symbolElement = (coords?: IPosition) => {
  const lineIndex = coords !== undefined ? `="${coords.lineIndex}"` : ''
  const symbolIndex = coords !== undefined ? `="${coords.indexInLine}"` : ''
  return `span[${symbolAttr}${symbolIndex}][${lineAttr}${lineIndex}]` as const
}

export const getClosestLine = (target: HTMLElement) => {
  return target.closest(lineElement())
}

export const getClosestSymbol = (target: HTMLElement) => {
  return target.closest(symbolElement())
}

export const getCoords = (target: HTMLElement) => {
  const editorStore = useEditorStore.getState()

  const line = getClosestLine(target)
  let lineIndex = Number(line?.getAttribute(lineAttr))

  lineIndex = isNaN(lineIndex) ? editorStore.lines.length - 1 : lineIndex

  const symbol = getClosestSymbol(target)

  let indexInLine = Number(symbol?.getAttribute(symbolAttr))

  indexInLine = isNaN(indexInLine)
    ? editorStore.lines[lineIndex].length
    : indexInLine

  return { lineIndex, indexInLine }
}
