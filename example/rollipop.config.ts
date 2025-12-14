import { defineConfig } from '@rollipop/pack';

export default defineConfig((_context) => {
  // console.log('context', JSON.stringify(context, null, 2));

  let t0 = 0;

  return {
    entry: 'index.js',
    plugins: [
      {
        name: 'example-plugin',
        buildStart() {
          t0 = performance.now();
          this.info('Rollipop build started!');
        },
        buildEnd() {
          const t1 = performance.now();
          this.info(`Rollipop build finished (${t1 - t0}ms)`);
        },
      },
    ],
    INTERNAL__rolldown: (config) => {
      // console.log('rolldown config', config);
      return config;
    },
  };
});
