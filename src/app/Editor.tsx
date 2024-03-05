import { useLayoutEffect, useRef } from 'react'
import { KeyEvents } from './keyEvents/keyEvents'
import './index.css'
interface EditorProps {
  wrapperClassName?: string
  width: number
  height: number
}

export default function Editor(props: EditorProps) {
  const wrapper = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!wrapper.current) throw new Error('wrapper component is null')

    const keyEvents = new KeyEvents(wrapper.current)
    keyEvents.createAllListeners()
  }, [])

  return (
    <div
      style={{ width: props.width, height: props.height, background: 'red' }}
      className={`text-3xl`}
      ref={wrapper}
    >
      asdfasdf
    </div>
  )
}
