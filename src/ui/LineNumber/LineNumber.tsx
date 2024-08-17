import { useContext } from 'react'
import { EditorClassNamesContext } from '../classNames.context'

interface LineNumber {
  count: number
}
export default function LineNumber(props: LineNumber) {
  const classNamesContext = useContext(EditorClassNamesContext)
  return (
    <div
      className={`p-1 min-w-9 bg-amber-400 mr-1 select-none 
        cursor-default text-right ${classNamesContext.lineNumberClassName ?? ''}`}
    >
      {props.count}
    </div>
  )
}
