import path from 'node:path';

import { generate } from '@babel/generator';
import * as swc from '@swc/core';
import flowRemoveTypes from 'flow-remove-types';
import * as hermesParser from 'hermes-parser';
import { SourceMap } from 'rolldown';

import { combineSourceMaps } from '../utils/sourcemap';

export function stripFlowSyntax(code: string, id: string) {
  const typeRemoved = flowRemoveTypes(code, { all: true, removeEmptyImports: true });
  const ast = hermesParser.parse(typeRemoved.toString(), { flow: 'all', babel: true });
  const generated = generate(ast, { sourceMaps: true, sourceFileName: path.basename(id) });
  const combinedMap = combineSourceMaps([
    generated.map,
    typeRemoved.generateMap(),
  ]) as unknown as SourceMap;

  return { code: generated.code, map: combinedMap };
}

export function blockScoping(code: string, id: string, dev: boolean) {
  const result = swc.transformSync(code, {
    configFile: false,
    swcrc: false,
    filename: path.basename(id),
    jsc: {
      target: 'es5',
      parser: {
        // Parse as TypeScript code because Flow modules can be `.js` files with type annotations
        syntax: 'typescript',
        // Always enable JSX parsing because Flow modules can be `.js` files with JSX syntax
        tsx: true,
      },
      keepClassNames: true,
      loose: false,
      transform: {
        react: {
          runtime: 'automatic',
          development: dev,
        },
      },
      assumptions: {
        setPublicClassFields: true,
        privateFieldsAsProperties: true,
      },
    },
    isModule: true,
  });

  return result;
}
