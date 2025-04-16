// rollup.config.js
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import tailwindcss from 'tailwindcss'; // Import Tailwind
import autoprefixer from 'autoprefixer'; // Import Autoprefixer
import terser from '@rollup/plugin-terser'; // Use the new Terser plugin
import { readFileSync } from 'fs';

// Import package.json
const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url))
);

export default {
  input: 'src/components/KaibanBoard/index.jsx',
  output: [
    {
      file: packageJson.module,
      format: 'es',
      sourcemap: false,
      plugins: [terser()],
      inlineDynamicImports: true, // Inline dynamic imports to avoid chunking
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: ['.js', '.jsx'],
      preferBuiltins: true, // Prefer Node.js built-in modules
    }),
    commonjs({
      transformMixedEsModules: true, // Handle mixed require/import modules
    }),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      babelHelpers: 'bundled',
    }),
    postcss({
      extract: 'index.css', // Extracts CSS into separate files
      minimize: true, // Minify the extracted CSS
      plugins: [
        tailwindcss(), // Add Tailwind CSS as a plugin
        autoprefixer(), // Add Autoprefixer for browser compatibility
      ],
    }),
    image(), // Handle image imports
    json(), // Handle JSON imports
  ],
  external: ['react', 'react-dom', 'kaibanjs'], // Mark these as external to prevent bundling
};
