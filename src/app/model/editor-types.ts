import React from 'react'
import { DeepPartial } from '@/shared/utils/types/types'
import { ILexTheme } from './lex/lexTheme.model'

export const defaultEditorTextTheme: ILexTheme = {
  $keywords: '#ef476f',
  $operators: '#f78c6b',
  comments: '#ffd166',
  default: '#06d6a0',
  string: '#118ab2',
  variables: '#073b4c',
}

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
