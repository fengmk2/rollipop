import path from 'node:path';

import { merge } from 'es-toolkit';

import type { BuildOptions } from '../core/types';

const DEFAULT_BUILD_OPTIONS = {
  dev: true,
  cache: true,
  minify: false,
} satisfies Partial<BuildOptions>;

export function resolveBuildOptions(projectRoot: string, buildOptions: BuildOptions) {
  if (buildOptions.outfile) {
    buildOptions.outfile = path.resolve(projectRoot, buildOptions.outfile);
  }

  if (buildOptions.sourcemap) {
    buildOptions.sourcemap = path.resolve(projectRoot, buildOptions.sourcemap);
  }

  return merge(DEFAULT_BUILD_OPTIONS, buildOptions);
}

export type ResolvedBuildOptions = ReturnType<typeof resolveBuildOptions>;
