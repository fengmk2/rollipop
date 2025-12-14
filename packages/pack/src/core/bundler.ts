import { Logo, getCachePath, Storage } from '@rollipop/common';
import { invariant, pick } from 'es-toolkit';
import * as rolldown from 'rolldown';

import type { ResolvedConfig } from '../config/defaults';
import { md5 } from '../utils/hash';
import { serialize } from '../utils/serialize';
import { FileSystemCache } from './cache/file-system-cache';
import { resolveRolldownOptions } from './rolldown';
import type { BuildOptions } from './types';

export class Bundler {
  private readonly cache: FileSystemCache;
  private readonly storage: Storage;

  static getId(config: ResolvedConfig, buildOptions: BuildOptions) {
    return md5(
      serialize({
        config: pick(config, ['resolver', 'transformer', 'serializer', 'plugins']),
        buildOptions: pick(buildOptions, ['platform', 'dev']),
      }),
    );
  }

  constructor(private readonly config: ResolvedConfig) {
    Logo.printLogoOnce();
    this.cache = new FileSystemCache(getCachePath(this.config.root));
    this.storage = Storage.getInstance(this.config.root);
  }

  async build(buildOptions: BuildOptions) {
    const { config, cache, storage } = this;

    const buildHash = Bundler.getId(config, buildOptions);
    const context = { buildHash, cache, storage };
    const rolldownOptions = await resolveRolldownOptions(config, context, buildOptions);
    const rolldownBuildOptions: rolldown.BuildOptions = {
      ...rolldownOptions.input,
      output: rolldownOptions.output,
      write: true,
    };

    const buildResult = await rolldown.build(rolldownBuildOptions);
    const chunk = buildResult.output[0];
    invariant(chunk, 'Bundled chunk is not found');

    return chunk;
  }
}
