import { mergeWith } from 'es-toolkit';

import type { DefaultConfig, ResolvedConfig } from './defaults';
import type { Config } from './types';

export function mergeConfig(baseConfig: DefaultConfig, overrideConfig: Config): ResolvedConfig {
  return mergeWith(baseConfig, overrideConfig, (target, source, key) => {
    if (key === 'reporter') {
      return source.reporter ?? target.reporter;
    }
  });
}
