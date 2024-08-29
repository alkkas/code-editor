import { IEditorStore, IRange } from '@/store/editorStore.types'
import { LanguageName } from '@/model/languages/map'
import { ILexTheme } from '@/model/lex/lexTheme.model'
import { SetType } from '@/store/setters/common'

export interface IPropsSetters {
  setTextTheme: (textTheme: ILexTheme) => void
  setLanguage: (lang: LanguageName) => void
}

export const setProps = (
  get: () => IEditorStore,
  set: SetType
): IPropsSetters => {
  return {
    setLanguage(language) {
      set((state) => {
        state.highlighter.language = language
      })
    },

    setTextTheme(textTheme) {
      set((state) => {
        state.highlighter.editorText = textTheme
      })
    },
  }
}
