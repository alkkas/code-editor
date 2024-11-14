import { LexModel } from '@/model/lex/lex.model'

export type LanguageName = 'typescript' | 'python'

export const languagesMap: Record<LanguageName, () => Promise<LexModel>> = {
  typescript: () => import('./configs/typescript').then((r) => r.default),
  python: () => import('./configs/python').then((r) => r.default),
}
