import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import terser from '@rollup/plugin-terser'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
export default [
  {
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
    external: ['react/jsx-runtime', 'react'],
    plugins: [
      resolve(),
      commonjs(),
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
      // babel({
      //   exclude: 'node_modules/**',
      //   presets: ['@babel/preset-react'],
      //   babelHelpers: 'bundled',
      // }),
      external({
        includeDependencies: true,
      }),
      // terser(),
      typescript(),
    ],
  },
]
