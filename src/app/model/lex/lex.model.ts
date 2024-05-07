type LexModel = {
  keywords: string[]
  comments: { singleLine: string; multiLine: { start: string; finish: string } }
  tokens: Record<string, unknown>
}
