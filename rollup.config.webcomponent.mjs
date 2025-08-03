// rollup.config.webcomponent.mjs
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { readFileSync } from 'fs';

// Import package.json
const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url))
);

export default {
  input: 'src/web-component/kaiban-board-element.js',
  output: [
    {
      file: 'dist/kaiban-board-element.js',
      format: 'umd',
      name: 'KaibanBoardElement',
      sourcemap: true,
      inlineDynamicImports: true, // Inline dynamic imports to avoid code splitting
      // Global variables for external dependencies (CDN)
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react-dom/client': 'ReactDOM',
        'kaibanjs': 'KaibanJS',
        '@kaibanjs/tools': 'KaibanJSTools'
      }
    },
    {
      file: 'dist/kaiban-board-element.esm.js',
      format: 'es',
      sourcemap: true,
      inlineDynamicImports: true
    },
    {
      file: 'dist/kaiban-board-element.min.js',
      format: 'iife',
      name: 'KaibanBoardElement',
      sourcemap: false,
      inlineDynamicImports: true,
      plugins: [terser()],
      // Global variables for external dependencies (CDN)
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react-dom/client': 'ReactDOM',
        'kaibanjs': 'KaibanJS',
        '@kaibanjs/tools': 'KaibanJSTools'
      }
    }
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    }),
    resolve({
      extensions: ['.js', '.jsx'],
      preferBuiltins: true,
      browser: true
    }),
    commonjs({
      include: /node_modules/,
      transformMixedEsModules: true
    }),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx']
    }),
    postcss({
      extract: 'kaiban-board-element.css',
      minimize: true,
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }),
    image(),
    json()
  ],
  // Smart external strategy: Externalize React to prevent Hook conflicts
  // and KaibanJS to reduce bundle size (load from CDN)
  external: [
    'react', 
    'react-dom', 
    'react-dom/client',
    'kaibanjs',
    '@kaibanjs/tools'
  ]
};