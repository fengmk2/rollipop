import path from 'path';

import * as babel from '@babel/core';
import type * as rolldown from 'rolldown';

export interface CodegenPluginOptions {
  filter: rolldown.HookFilter;
}

export function codegenPlugin(options: CodegenPluginOptions): rolldown.Plugin {
  return {
    name: 'rollipop:codegen',
    transform: {
      filter: options.filter,
      handler(code, id) {
        this.debug(`Transforming codegen native component ${id}`);

        const result = babel.transformSync(code, {
          babelrc: false,
          configFile: false,
          filename: path.basename(id),
          parserOpts: {
            flow: 'all',
          } as any,
          plugins: [
            require.resolve('babel-plugin-syntax-hermes-parser'),
            require.resolve('@babel/plugin-transform-flow-strip-types'),
            [require.resolve('@babel/plugin-syntax-typescript'), false],
            require.resolve('@react-native/babel-plugin-codegen'),
          ],
          overrides: [
            {
              test: /\.ts$/,
              plugins: [
                ['@babel/plugin-syntax-typescript', { isTSX: false, allowNamespaces: true }],
              ],
            },
            {
              test: /\.tsx$/,
              plugins: [
                ['@babel/plugin-syntax-typescript', { isTSX: true, allowNamespaces: true }],
              ],
            },
          ],
        });

        if (result?.code == null) {
          throw new Error(`Failed to transform codegen native component: ${id}`);
        }

        return result.code;
      },
    },
  };
}
