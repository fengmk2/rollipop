import type { DefaultConfig, ResolvedConfig } from './defaults';
import type { Config } from './types';

export function mergeConfig(baseConfig: DefaultConfig, overrideConfig: Config): ResolvedConfig {
  return {
    ...baseConfig,
    ...overrideConfig,
    resolver: {
      ...baseConfig.resolver,
      ...overrideConfig.resolver,
    },
    transformer: {
      flow: {
        filter: overrideConfig?.transformer?.flow?.filter ?? baseConfig.transformer.flow.filter,
      },
    },
    serializer: {
      ...baseConfig.serializer,
      ...overrideConfig.serializer,
    },
    reactNative: {
      ...baseConfig.reactNative,
      ...overrideConfig.reactNative,
      codegen: {
        filter:
          overrideConfig?.reactNative?.codegen?.filter ?? baseConfig.reactNative.codegen.filter,
      },
    },
    INTERNAL__rolldown: overrideConfig.INTERNAL__rolldown,
  };
}
