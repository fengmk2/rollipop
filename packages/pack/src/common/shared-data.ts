import path from 'node:path';

export function getSharedDataPath(basePath: string) {
  return path.join(basePath, '.rollipop');
}
