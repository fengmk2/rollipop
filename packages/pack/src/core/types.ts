import type { Storage } from '@rollipop/common';

import type { FileSystemCache } from './cache/file-system-cache';

export interface BuildOptions {
  platform: string;
  dev?: boolean;
  minify?: boolean;
  cache?: boolean;
  outfile?: string;
}

export interface BundlerContext {
  cache: FileSystemCache;
  storage: Storage;
  buildHash: string;
}
