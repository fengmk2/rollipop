import { defineConfig } from 'vite-plus/lib';

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist',
  format: 'esm',
  platform: 'node',
  fixedExtension: false,
  dts: false,
});
