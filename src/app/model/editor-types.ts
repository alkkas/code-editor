import React from 'react'
import { DeepPartial } from '@/shared/utils/types/types'
import { ILexTheme } from './lex/lexTheme.model'

interface ITheme {
  main: {
    primary: string
    secondary: string
  }
  editorText: ILexTheme
}

export interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {
  wrapperClassName?: string
  fontSize?: number
  theme?: DeepPartial<ITheme>
  width: number
  height: number
}
