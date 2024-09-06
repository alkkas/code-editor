import React from 'react'
import { ILexTheme } from './lex/lexTheme.model'
import { LanguageName } from './languages/map'

export const defaultEditorTextTheme: ILexTheme = {
  $keywords: '#ef476f',
  $operators: '#f78c6b',
  comments: '#ffd166',
  default: '#06d6a0',
  string: '#118ab2',
  variables: '#073b4c',
}

interface ITheme {
  main?: {
    primary: string
    secondary: string
  }
  editorText?: ILexTheme
}

export interface EditorClassNames {
  wrapperClassName?: string
  carriageClassName?: string
  lineNumberClassName?: string
  lineClassName?: string
}

export interface EditorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    EditorClassNames {
  language: LanguageName
  theme?: ITheme
  initialValue?: string
}
