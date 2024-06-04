import { ILexTheme } from './lexTheme.model'

type ExcludeSimpleEntities<E> = E extends `$${string}` ? E : never

export type Itoken<T extends ILexTheme> = [RegExp, ...(keyof T)[]]

export type LexModel<Theme extends ILexTheme> = {
  tokenizer: Itoken<Theme>[]
} & {
  [k in ExcludeSimpleEntities<keyof Theme>]: string[]
}
