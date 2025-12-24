import { defineConfig } from '@voidzero-dev/vite-plus/lib';

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist',
  format: ['esm', 'cjs'],
  platform: 'node',
  fixedExtension: false,
  dts: true,
});
