import fs from 'node:fs';
import path from 'node:path';

import { logger } from '../../logger';
import { getSharedDataPath } from '../fs/data';
import type { Cache } from './cache';

type Key = string;

export class FileSystemCache implements Cache<Key, string> {
  private readonly cacheDirectory: string;

  static getCacheDirectory(projectRoot: string) {
    return path.join(getSharedDataPath(projectRoot), 'cache');
  }

  static clearAll(projectRoot: string) {
    fs.rmSync(FileSystemCache.getCacheDirectory(projectRoot), { recursive: true, force: true });
  }

  constructor(projectRoot: string, id: string) {
    this.cacheDirectory = path.join(FileSystemCache.getCacheDirectory(projectRoot), id);
    this.ensureCacheDirectory(this.cacheDirectory);
    logger.debug('cache directory:', this.cacheDirectory);
  }

  private ensureCacheDirectory(cacheDirectory: string) {
    if (!fs.existsSync(cacheDirectory)) {
      fs.mkdirSync(cacheDirectory, { recursive: true });
    }
  }

  get(key: Key): string | undefined {
    try {
      return fs.readFileSync(path.join(this.cacheDirectory, key), 'utf-8');
    } catch {
      return undefined;
    }
  }

  set(key: Key, value: string) {
    try {
      fs.writeFileSync(path.join(this.cacheDirectory, key), value);
    } catch {
      logger.error('Failed to write cache file', key);
    }
  }

  clear() {
    fs.rmSync(this.cacheDirectory, { recursive: true, force: true });
    this.ensureCacheDirectory(this.cacheDirectory);
  }
}
