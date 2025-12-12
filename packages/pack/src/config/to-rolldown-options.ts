import fs from 'node:fs';
import type * as rolldown from 'rolldown';
import { stripFlowSyntax } from 'src/transformer/flow';
import { ResolvedConfig } from './defaults';
import { isNotNil } from 'es-toolkit';

export function toRolldownOptions(config: ResolvedConfig, platform: string) {
  const supportedExtensions = [
    ...config.resolver.sourceExtensions,
    ...config.resolver.assetExtensions,
  ];
  const platforms = [platform, config.resolver.preferNativePlatform ? 'native' : null].filter(
    isNotNil,
  );
  const resolveExtensions = [
    ...platforms.map((platform) => {
      return supportedExtensions.map((extension) => `.${platform}.${extension}`);
    }),
    ...supportedExtensions.map((extension) => `.${extension}`),
  ].flat();

  const inputOptions: rolldown.InputOptions = {
    input: config.entry,
    resolve: {
      extensions: resolveExtensions,
      mainFields: config.resolver.mainFields,
      conditionNames: config.resolver.conditionNames,
    },
    transform: {
      typescript: {
        removeClassFieldsWithoutInitializer: true,
      },
      assumptions: {
        setPublicClassFields: true,
      },
      jsx: {
        development: true,
        runtime: 'automatic',
      },
      helpers: {
        mode: 'Runtime',
      },
      target: 'es2015',
      define: {
        __DEV__: JSON.stringify(true),
        'process.env.NODE_ENV': JSON.stringify('development'),
        global: '__ROLLIPOP_GLOBAL',
      },
    },
    experimental: {
      strictExecutionOrder: true,
      disableLiveBindings: true,
    },
    platform: 'neutral',
    treeshake: false,
    cwd: config.root,
    checks: {
      /**
       * Disable eval check because react-native uses `eval` to execute code.
       */
      eval: false,
    },
  };

  const polyfillContents = (config.serializer?.polyfills ?? [])
    .map((polyfillPath) =>
      wrapWithIIFE(stripFlowSyntax(fs.readFileSync(polyfillPath, 'utf-8')), polyfillPath),
    )
    .join('\n');

  const outputOptions: rolldown.OutputOptions = {
    intro: [
      `var __BUNDLE_START_TIME__=globalThis.nativePerformanceNow?nativePerformanceNow():Date.now(),__DEV__=true,process=globalThis.process||{};process.env=process.env||{};process.env.NODE_ENV=process.env.NODE_ENV||"development";`,
      `var __ROLLIPOP_GLOBAL = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this;`,
      polyfillContents,
    ].join('\n'),
    format: 'iife',
    minify: false,
    keepNames: true,
  };

  return {
    input: inputOptions,
    output: outputOptions,
  };
}

function wrapWithIIFE(body: string, filepath: string) {
  return `
  // ${filepath}
  (function (global) {
  ${indent(body, 2)}
  })(__ROLLIPOP_GLOBAL);
  `;
}

function indent(text: string, indent: number) {
  return text.replace(/^/gm, ' '.repeat(indent));
}
