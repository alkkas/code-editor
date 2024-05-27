import { tsConfiguration } from './configs/typescript'

export const languagesMap = {
  typescript: tsConfiguration,
}

export type LanguageName = keyof typeof languagesMap
