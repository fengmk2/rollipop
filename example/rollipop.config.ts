import { defineConfig } from 'rollipop';

import { worklet } from './plugins';

export default defineConfig({
  entry: 'index.js',
  plugins: [worklet()],
});
