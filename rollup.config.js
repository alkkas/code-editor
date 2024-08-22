import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import workerLoader from 'rollup-plugin-web-worker-loader'
import { defineConfig } from 'rollup'

export default defineConfig({
  input: './src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.es.js',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  external: ['react'],
  plugins: [
    resolve(),
    commonjs(),
    workerLoader(),
    alias({
      entries: [{ find: '@/', replacement: './src' }],
    }),
    postcss({
      config: {
        path: './postcss.config.cjs',
      },
      extensions: ['.css'],
      minimize: true,
      inject: {
        insertAt: 'top',
      },
    }),
    ...(process.env.BUILD === 'prod'
      ? [
          babel({
            exclude: 'node_modules/**',
            presets: [
              '@babel/preset-react',
              [
                '@babel/preset-typescript',
                { isTSX: true, allExtensions: true },
              ],
            ],
            extensions: ['.ts', '.tsx'],
            babelHelpers: 'bundled',
          }),
          terser(),
        ]
      : []),
    // typescript(),
  ],
})
