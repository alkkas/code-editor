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
  language: LanguageName
}

export interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {
  wrapperClassName?: string
  fontSize?: number
  theme: ITheme
  width: number
  height: number
}
