import { defineConfig } from '@rollipop/pack';

export default defineConfig((context) => {
  console.log('context', context);

  return {
    entry: 'index.js',
  };
});
