import { resolve } from 'path'
import { defineConfig, PluginOption } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const commonPlugins: PluginOption[] = [
  tsconfigPaths(),
  dts({ rollupTypes: true }),
  cssInjectedByJsPlugin(),
]

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      external: ['react'],
    },
  },
  worker: {
    plugins: () => commonPlugins,
  },
  plugins: commonPlugins,
})
