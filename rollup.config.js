// rollup.config.js
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import path from 'path'

export default {
  input: path.resolve(__dirname, 'src/index.js'),
  output: [
    {
      file: 'dist/vue2-nepali-datepicker.es.js',
      format: 'es',
      globals: { vue: 'Vue' },
    },
    {
      file: 'dist/vue2-nepali-datepicker.cjs.js',
      format: 'cjs',
      globals: { vue: 'Vue' },
    },
    {
      file: 'dist/vue2-nepali-datepicker.umd.js',
      format: 'umd',
      name: 'Vue2NepaliDatepicker',
      globals: { vue: 'Vue' },
    },
  ],
  external: ['vue'],
  plugins: [
    vue({
      css: true,
      compileTemplate: true,
    }),
    postcss({
      extract: true,
      minimize: true,
      sourceMap: false,
    }),
    json(),
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
    }),
    terser(),
  ],
}
