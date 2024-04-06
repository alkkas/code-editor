import { useEditorStore } from '@/entities/editor-store/model/editorStore'
import { lineAttr, symbolAttr } from '@/shared/utils/lib/elements.const'

export const lineElement = (index?: number) => {
  const lineIndex = index !== undefined ? `="${index}"` : ''
  return `div[${lineAttr}${lineIndex}]` as const
}

export const symbolElement = (index?: number) => {
  const symbolIndex = index !== undefined ? `="${index}"` : ''
  return `span[${symbolAttr}${symbolIndex}]` as const
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
