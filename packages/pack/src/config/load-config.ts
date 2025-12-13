import * as c12 from 'c12';

import { getDefaultConfig } from './defaults';
import { mergeConfig } from './merge-config';
import type { Config } from './types';

const CONFIG_FILE_NAME = 'rollipop.config';

export async function loadConfig(basePath = process.cwd()) {
  const defaultConfig = getDefaultConfig(basePath);
  const { config: userConfig } = await c12.loadConfig<Config>({
    context: { defaultConfig },
    configFile: CONFIG_FILE_NAME,
    cwd: basePath,
    defaultConfig,
  });

  return mergeConfig(defaultConfig, userConfig);
}
