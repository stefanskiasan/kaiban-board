// rollup.config.js
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import tailwindcss from 'tailwindcss';  // Import Tailwind
import autoprefixer from 'autoprefixer'; // Import Autoprefixer
import terser from '@rollup/plugin-terser';  // Use the new Terser plugin


// Import package.json as a module
import packageJson from './package.json' assert { type: 'json' };

export default {
  input: 'src/components/KaibanBoard/index.jsx', // Entry point for your component
  output: [
    {
      file: packageJson.module, // ES Module build output
      format: 'es',
      sourcemap: false,
      plugins: [terser()],  // Minify JS using Terser
    },
  ],
  plugins: [
    peerDepsExternal(), // Exclude peer dependencies like React from the bundle
    resolve({
      extensions: ['.js', '.jsx'], // Resolve JS and JSX files
    }),
    commonjs(), // Convert CommonJS to ES Modules
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      babelHelpers: 'bundled',
    }),
    postcss({
      extract: 'index.css', // Extracts CSS into separate files
      minimize: true,        // Minify the extracted CSS      
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
