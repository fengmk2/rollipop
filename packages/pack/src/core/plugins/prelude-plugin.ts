import fs from 'node:fs';
import * as rolldown from 'rolldown';
import { shim } from './shim';

export interface PreludePluginOptions {
  modulePaths: string[];
}

interface PreludePluginModuleInfo extends rolldown.ModuleInfo {
  meta: {
    isEntry: true;
  };
}

export function preludePlugin(options: PreludePluginOptions): rolldown.Plugin {
  if (options.modulePaths.length === 0) {
    return shim();
  }

  const preludeImportStatements = options.modulePaths
    .map((modulePath) => `import '${modulePath}';`)
    .join('\n');

  let processed = false;

  return {
    name: 'rollipop:prelude',
    buildStart() {
      processed = false;
    },
    resolveId: {
      handler: (source, _importer, extraOptions) => {
        if (extraOptions.isEntry) {
          return { id: source, meta: { isEntry: true } };
        }
      },
    },
    load: {
      handler(id) {
        if (processed) {
          return;
        }

        const moduleInfo = this.getModuleInfo(id);

        if (moduleInfo && isPreludePluginModuleInfo(moduleInfo)) {
          this.debug(`Prelude plugin found entry ${id}`);
          const originSource = fs.readFileSync(id, 'utf-8');
          const modifiedSource = [preludeImportStatements, originSource].join('\n');

          processed = true;

          return modifiedSource;
        }
      },
    },
  };
}

function isPreludePluginModuleInfo(
  moduleInfo: rolldown.ModuleInfo,
): moduleInfo is PreludePluginModuleInfo {
  return 'isEntry' in moduleInfo.meta;
}
