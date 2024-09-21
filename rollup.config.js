import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import tailwindcss from 'tailwindcss';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/components/KaibanBoard/index.jsx',
  output: [
    {
      dir: 'dist',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src'
    }
  ],
  plugins: [
    resolve({
      extensions: ['.js', '.jsx', '.json'],
      moduleDirectory: ['node_modules', 'src']
    }),
    commonjs(),
    json(),
    postcss({
      plugins: [tailwindcss()],
      extract: 'index.css'
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react', '@babel/preset-env'],
      extensions: ['.js', '.jsx']
    }),
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    terser()
  ],
//   external: ['react', 'react-dom']
};
