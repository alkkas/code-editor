import { useLayoutEffect, useRef } from 'react'
import { KeyEvents } from './model/keyEvents/keyEvents'
import { EditorProps } from './model/editor-types'
import { Carriage } from '@/shared/Carriage/Carriage'
import './index.css'
import { useEditorStore } from '@/entities/editor-store/editorStore'
import LineNumber from '@/shared/LineNumber/LineNumber'

export default function Editor(props: EditorProps) {
  const wrapper = useRef<HTMLDivElement>(null)
  const fontSize = props.fontSize ?? 16
  const editorStore = useEditorStore()

  useLayoutEffect(() => {
    if (!wrapper.current) throw new Error('wrapper component is null')

    const keyEvents = new KeyEvents(wrapper.current)

    keyEvents.createAllListeners()

    return keyEvents.deleteAllListeners.bind(keyEvents)
  }, [])

  const isCarriageAroundThisSymbol = (line_idx: number, symbol_idx: number) => {
    console.log(editorStore.currentCarriagePos.indexInLine, symbol_idx)
    return (
      editorStore.isFocused &&
      line_idx === editorStore.getCurrentLineIndex() &&
      symbol_idx === editorStore.getCurrentIndexInLine() - 1
    )
  }

  return (
    <div
      {...props}
      style={{ ...props.style, width: props.width, height: props.height }}
      ref={wrapper}
      className="bg-secondary border-primary border cursor-text"
      tabIndex={0}
    >
      {editorStore.lines.map((line, line_idx) => (
        <div key={line_idx} className="flex items-center">
          <LineNumber count={line_idx + 1} />
          <>
            {line.map((symbol, symbol_idx) => (
              <>
                {isCarriageAroundThisSymbol(line_idx, symbol_idx) && (
                  <Carriage fontSize={fontSize} />
                )}
                <div key={symbol_idx}>{symbol.value}</div>
              </>
            ))}
          </>
        </div>
      ))}
    </div>
  )
}
