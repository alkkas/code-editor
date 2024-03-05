interface LineNumber {
  count: number
}
export default function LineNumber(props: LineNumber) {
  return <div>{props.count}</div>
}
