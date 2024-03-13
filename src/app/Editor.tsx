import { useLayoutEffect, useRef } from 'react'
import { KeyEvents } from './model/keyEvents/keyEvents'
import { EditorProps } from './model/editor-types'
import './index.css'
import { Carriage } from '@/shared/Carriage/Carriage'

export default function Editor(props: EditorProps) {
  const wrapper = useRef<HTMLDivElement>(null)
  const fontSize = props.fontSize ?? 16

  useLayoutEffect(() => {
    if (!wrapper.current) throw new Error('wrapper component is null')

    const keyEvents = new KeyEvents(wrapper.current)
    keyEvents.createAllListeners()
  }, [])

  return (
    <div
      {...props}
      style={{ ...props.style, width: props.width, height: props.height }}
      ref={wrapper}
      className="bg-secondary border-primary border cursor-text"
    >
      <div>
        <Carriage fontSize={fontSize} />
      </div>
    </div>
  )
}
