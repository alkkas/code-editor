import { LexModel } from '@/model/lex/lex.model'

export type LanguageName = 'typescript'

export const languagesMap: Record<LanguageName, () => Promise<LexModel>> = {
  typescript: () =>
    import('./configs/typescript').then(
      (r) => r.default
    ) as unknown as Promise<LexModel>,
}
