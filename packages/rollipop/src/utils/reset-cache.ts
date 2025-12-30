import { FileSystemCache } from '../core/cache/file-system-cache';

export function resetCache(projectRoot: string) {
  FileSystemCache.clearAll(projectRoot);
}
