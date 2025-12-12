import path from 'node:path';
import * as rolldown from 'rolldown';
import { invariant } from 'es-toolkit';
import { resolveRolldownOptions } from 'src/config/resolve-rolldown-options';
import type { ResolvedConfig } from 'src/config/defaults';
import type { BuildOptions } from './types';
import { toBundleFileName } from 'src/utils/to-bundle-file-name';

export class Bundler {
  /**
   * @TODO
   */
  static createServer(bundler: Bundler) {}

  constructor(private readonly config: ResolvedConfig) {}

  async build(buildOptions: BuildOptions) {
    const bundleFileName = toBundleFileName(this.config.entry, buildOptions.platform);
    const bundleFileDestination = path.join(buildOptions.outDir ?? 'dist', bundleFileName);
    const rolldownOptions = await resolveRolldownOptions(this.config, buildOptions);
    const rolldownBuildOptions: rolldown.BuildOptions = {
      ...rolldownOptions.input,
      output: {
        ...rolldownOptions.output,
        file: bundleFileDestination,
      },
      write: true,
    };

    const buildResult = await rolldown.build(rolldownBuildOptions);
    const chunk = buildResult.output[0];
    invariant(chunk, 'Bundled chunk is not found');

    return chunk;
  }
}
