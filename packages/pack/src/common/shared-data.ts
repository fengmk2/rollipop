import fs from 'node:fs';
import path from 'node:path';

export function getSharedDataPath(basePath: string) {
  return path.join(basePath, '.rollipop');
}

export function ensureSharedDataPath(basePath: string) {
  const sharedDataPath = getSharedDataPath(basePath);

  if (!fs.existsSync(sharedDataPath)) {
    fs.mkdirSync(sharedDataPath, { recursive: true });
  }

  return sharedDataPath;
}
