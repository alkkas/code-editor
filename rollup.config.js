import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import workerLoader from 'rollup-plugin-web-worker-loader'
import { defineConfig } from 'rollup'

const extensions = ['.ts', '.tsx', '.js', '.jsx']

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
    resolve({ extensions }),
    commonjs(),
    workerLoader(),
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
              [
                '@babel/preset-env',
                {
                  targets: { chrome: '58', ie: '11' },
                  useBuiltIns: 'usage',
                  corejs: '3.38.1',
                },
              ],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
            plugins: [
              [
                'module-resolver',
                {
                  root: ['./src'],
                  alias: {
                    '@': ([, name]) => `./src${name}`,
                  },
                },
              ],
            ],
            extensions,
            babelHelpers: 'bundled',
          }),
          terser(),
        ]
      : [
          alias({
            entries: [{ find: '@/', replacement: './src' }],
          }),
          typescript(),
        ]),
  ],
})
