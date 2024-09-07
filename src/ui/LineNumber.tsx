import { useContext } from 'react'
import { EditorClassNamesContext } from './classNames.context'
import { useEditorStore } from '@/store/editorStore'

interface LineNumber {
  count: number
  lineIndex: number
}
export default function LineNumber(props: LineNumber) {
  const classNamesContext = useContext(EditorClassNamesContext)

  return (
    <div
      className={`pr-1 min-w-8 bg-amber-400 mr-1 select-none 
        cursor-default text-right ${classNamesContext.lineNumberClassName ?? ''}`}
    >
      {props.count}
    </div>
  )
}
