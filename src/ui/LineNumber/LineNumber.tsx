interface LineNumber {
  count: number
}
export default function LineNumber(props: LineNumber) {
  return (
    <div className="p-1 min-w-9 bg-amber-400 mr-1 select-none cursor-default text-sm text-right">
      {props.count}
    </div>
  )
}
