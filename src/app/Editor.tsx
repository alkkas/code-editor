import React, { useLayoutEffect, useRef } from 'react'
import { KeyEvents } from './keyEvents/keyEvents'
import './index.css'
interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {
  wrapperClassName?: string
  fontSize?: number
  width: number
  height: number
}

export default function Editor(props: EditorProps) {
  const wrapper = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!wrapper.current) throw new Error('wrapper component is null')

    const keyEvents = new KeyEvents(wrapper.current)
    keyEvents.createAllListeners()
    document.addEventListener('keydown', (event) => console.log(event))
  }, [])

  return (
    <div
      {...props}
      style={{ ...props.style, width: props.width, height: props.height }}
      className={``}
      ref={wrapper}
    ></div>
  )
}
