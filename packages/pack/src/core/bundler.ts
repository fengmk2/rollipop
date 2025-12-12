import * as rolldown from 'rolldown';
import { invariant } from 'es-toolkit';
import { toRolldownOptions } from 'src/config/to-rolldown-options';
import { stripFlowSyntaxPlugin } from './plugins/strip-flow-syntax-plugin';
import { preludePlugin } from './plugins/prelude-plugin';
import { assetRegistryPlugin } from './plugins/asset-registry-plugin';
import { codegenPlugin } from './plugins/codegen-plugin';
import { ResolvedConfig } from 'src/config/defaults';

export class Bundler {
  private readonly rolldownInputOptions: rolldown.InputOptions;
  private readonly rolldownOutputOptions: rolldown.OutputOptions;

  /**
   * @TODO
   */
  static createServer(bundler: Bundler) {}

  constructor(private readonly config: ResolvedConfig) {
    const { input, output } = toRolldownOptions(this.config, 'ios');
    this.rolldownInputOptions = input;
    this.rolldownOutputOptions = output;
  }

  async build() {
    const { resolver, transformer, serializer, reactNative } = this.config;
    const buildOptions: rolldown.BuildOptions = {
      ...this.rolldownInputOptions,
      plugins: [
        preludePlugin({ modulePaths: serializer.prelude }),
        codegenPlugin({ filter: reactNative.codegen.filter }),
        stripFlowSyntaxPlugin({ filter: transformer.flow.filter }),
        assetRegistryPlugin({
          assetExtensions: resolver.assetExtensions,
          assetRegistryPath: reactNative.assetRegistryPath,
        }),
      ],
      output: {
        ...this.rolldownOutputOptions,
        dir: 'dist' /** @TODO */,
      },
      write: true,
    };

    const t0 = performance.now();
    const buildResult = await rolldown.build(buildOptions);
    const t1 = performance.now();

    console.log(`Rolldown build took ${t1 - t0}ms`);

    const chunk = buildResult.output[0];
    invariant(chunk, 'Bundled chunk is not found');

    return chunk;
  }
}
