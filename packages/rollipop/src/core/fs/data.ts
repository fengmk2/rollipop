import fs from 'node:fs';
import path from 'node:path';

import { SHARED_DATA_PATH } from '../../common/constants';

export function getSharedDataPath(basePath: string) {
  return path.join(basePath, SHARED_DATA_PATH);
}

export function ensureSharedDataPath(basePath: string) {
  const sharedDataPath = getSharedDataPath(basePath);

  if (!fs.existsSync(sharedDataPath)) {
    fs.mkdirSync(sharedDataPath, { recursive: true });
  }

  return sharedDataPath;
}
