interface LineNumber {
  count: number
}
export default function LineNumber(props: LineNumber) {
  return <div className="p-1 bg-amber-400 mr-1">{props.count}</div>
}
