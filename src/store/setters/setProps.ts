import { IEditorStore } from '@/store/editorStore.types'
import { LanguageName, languagesMap } from '@/model/languages/map'
import { ILexTheme } from '@/model/lex/lexTheme.model'
import { SetType } from '@/store/setters/common'

export interface IPropsSetters {
  setTextTheme: (textTheme: ILexTheme) => void
  setLanguage: (lang: LanguageName) => Promise<void>
}

export const setProps = (
  get: () => IEditorStore,
  set: SetType
): IPropsSetters => {
  return {
    async setLanguage(language) {
      const languageConf = await languagesMap[language]()
      set((state) => {
        state.highlighter.language = languageConf
      })
    },

    setTextTheme(textTheme) {
      set((state) => {
        state.highlighter.editorText = textTheme
      })
    },
  }
}
