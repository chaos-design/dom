import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

let assetsDir = '';
let basePath = '';
const isGithubActions = process.env.GITHUB_ACTIONS || false;

if (isGithubActions) {
  // @ts-ignore
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');

  assetsDir = `/${repo}/`;
  basePath = `/${repo}`;
}

// https://vitejs.dev/config/
export default defineConfig({
  base: basePath,
  build: {
    assetsDir,
    rollupOptions: {
      output: {
        entryFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]',
      },
    },
  },
  plugins: [react()],
});
