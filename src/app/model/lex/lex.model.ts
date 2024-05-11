type LexModel = {
  keywords: string[]
  operators: string[]
  comments: { singleLine: RegExp; multiLine: { start: RegExp; finish: RegExp } }
  tokens: Record<string, unknown>
}
