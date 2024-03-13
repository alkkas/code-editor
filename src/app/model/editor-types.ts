import React from 'react'
import { DeepPartial } from '@/shared/utils/types/types'

interface ITheme {
  main: {
    primary: string
    secondary: string
  }
  editorText: {
    keywords: string
    operators: string
  }
}

export interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {
  wrapperClassName?: string
  fontSize?: number
  theme?: DeepPartial<ITheme>
  width: number
  height: number
}
