import fs from 'node:fs';

import type * as rolldown from 'rolldown';

function jsonPlugin(): rolldown.Plugin {
  return {
    name: 'rollipop:json',
    load: {
      filter: {
        id: /\.json$/,
      },
      handler(id) {
        const rawJson = fs.readFileSync(id, 'utf-8');
        const json = JSON.parse(rawJson);

        return {
          code: jsonToEsm(json),
          moduleType: 'js',
        };
      },
    },
  };
}

function jsonToEsm(data: Record<string, unknown>) {
  const declarations: string[] = [];
  const exports: string[] = [];
  const exportDefaultMappings: string[] = [];

  Object.entries(data).forEach(([key, value], index) => {
    const identifier = `_${index}`;
    declarations.push(`const ${identifier} = ${JSON.stringify(value)};`);
    exports.push(`export { ${identifier} as "${key}" };`);
    exportDefaultMappings.push(`"${key}":${identifier}`);
  });

  return [...declarations, ...exports, `export default {${exportDefaultMappings.join(',')}};`].join(
    '\n',
  );
}

export { jsonPlugin as json };
