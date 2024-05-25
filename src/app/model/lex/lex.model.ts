import { ILexTheme } from './lexTheme.model'

type ExcludeSimpleEntities<E> = E extends `$${string}` ? E : never

export type LexModel<Theme extends ILexTheme> = {
  tokenizer: [RegExp, ...(keyof Theme)[]][]
} & {
  [k in ExcludeSimpleEntities<keyof Theme>]: string[]
}
