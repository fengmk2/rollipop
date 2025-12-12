const { Bundler, loadConfig } = require('@rollipop/pack');

async function main() {
  const config = await loadConfig(process.cwd());
  const bundler = new Bundler(config);

  await bundler.build({
    dev: true,
    platform: 'ios',
    outDir: 'dist',
  });
}

main()
  .then(() => {
    console.log('Build completed');
  })
  .catch((error) => {
    console.error('Build failed', error);
  });
