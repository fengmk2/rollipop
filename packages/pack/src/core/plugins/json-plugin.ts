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
  const keys = new Set<string>();
  const fields = Object.entries(data).map(([key, value]) => {
    keys.add(key);
    return `export const ${key} = ${JSON.stringify(value)};`;
  });

  let dataIdent = '__data__';
  let index = 0;
  while (keys.has(dataIdent)) {
    dataIdent = `__data__${index++}`;
  }

  return [
    ...fields,
    `const ${dataIdent} = ${JSON.stringify(data)};`,
    `export { ${dataIdent} as default };`,
  ].join('\n');
}

export { jsonPlugin as json };
