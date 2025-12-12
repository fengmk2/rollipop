import { getInitializeCorePath, getPolyfillScriptPaths } from 'src/internal/react-native';
import { resolveReactNativePath } from 'src/utils/resolve-react-native-path';
import type { Config } from './types';
import * as rolldown from 'rolldown';

/**
 * Unlike the Metro bundler configuration, this prioritizes resolving module(ESM) fields first.
 *
 * @see {@link https://github.com/facebook/metro/blob/0.81.x/docs/Configuration.md#resolvermainfields}
 */
export const RESOLVER_MAIN_FIELDS = ['react-native', 'module', 'main'];
export const RESOLVER_CONDITION_NAMES = ['react-native', 'import', 'require'];

/**
 * Unlike the Metro bundler configuration, this prioritizes resolving TypeScript and ESM first.
 *
 * @see {@link https://github.com/facebook/metro/blob/0.81.x/packages/metro-config/src/defaults/defaults.js}
 * @see {@link https://github.com/facebook/metro/blob/0.81.x/packages/metro-file-map/src/workerExclusionList.js}
 */
export const SOURCE_EXTENSIONS = [
  'ts',
  'tsx',
  'js',
  'jsx',
  // Additional module formats
  'mjs',
  'cjs',
  // JSON files
  'json',
];

export const ASSET_EXTENSIONS = [
  // Image formats
  'bmp',
  'gif',
  'jpg',
  'jpeg',
  'png',
  'psd',
  'svg',
  'webp',
  'xml',
  // Video formats
  'm4v',
  'mov',
  'mp4',
  'mpeg',
  'mpg',
  'webm',
  // Audio formats
  'aac',
  'aiff',
  'caf',
  'm4a',
  'mp3',
  'wav',
  // Document formats
  'html',
  'pdf',
  'yaml',
  'yml',
  // Font formats
  'otf',
  'ttf',
  // Archives (virtual files)
  'zip',
];

export function getDefaultConfig(basePath: string) {
  const reactNativePath = resolveReactNativePath(basePath);

  return {
    root: basePath,
    entry: 'index.js',
    resolver: {
      sourceExtensions: SOURCE_EXTENSIONS,
      assetExtensions: ASSET_EXTENSIONS,
      mainFields: RESOLVER_MAIN_FIELDS,
      conditionNames: RESOLVER_CONDITION_NAMES,
      preferNativePlatform: true,
    },
    transformer: {
      flow: {
        filter: {
          id: /\.jsx?$/,
          code: /@flow/,
        } as rolldown.HookFilter,
      },
    },
    serializer: {
      prelude: [getInitializeCorePath(basePath)],
      polyfills: [...getPolyfillScriptPaths(reactNativePath)],
    },
    reactNative: {
      assetRegistryPath: 'react-native/Libraries/Image/AssetRegistry.js',
      codegen: {
        filter: {
          id: /(?:^|[\\/])(?:Native\w+|(\w+)NativeComponent)\.[jt]sx?$/,
        },
      },
    },
  };
}

export type DefaultConfig = ReturnType<typeof getDefaultConfig>;
export type ResolvedConfig = Config & DefaultConfig;
