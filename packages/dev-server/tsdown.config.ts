import fs from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist',
  format: ['esm', 'cjs'],
  platform: 'node',
  fixedExtension: false,
  dts: true,
  onSuccess(config) {
    const source = path.join(import.meta.dirname, 'assets');
    const destination = path.join(config.outDir, 'assets');

    fs.cpSync(source, destination, { recursive: true });
  },
});
