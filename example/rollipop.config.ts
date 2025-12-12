import { defineConfig } from '@rollipop/pack';

export default defineConfig((context) => {
  console.log('context', context);

  let t0 = 0;

  return {
    entry: 'index.js',
    plugins: [
      {
        name: 'test',
        buildStart() {
          t0 = performance.now();
          console.log('build started!');
        },
        buildEnd() {
          const t1 = performance.now();
          console.log('build ended! took:', t1 - t0);
        },
      },
    ],
    INTERNAL__rolldown: (config) => {
      console.log('rolldown config', config);
      return config;
    },
  };
});
