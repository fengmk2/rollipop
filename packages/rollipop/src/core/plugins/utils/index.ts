import fs from 'node:fs';

import type * as rolldown from 'rolldown';

import { xxhash } from '../../../utils/hash';
import type { BundlerContext } from '../../types';

const CACHE_HIT = Symbol('CACHE_HIT');

export interface WithCacheOptions {
  enabled: boolean;
  sourceExtensions: string[];
  context: BundlerContext;
}

/**
 * @internal
 */
export function withPersistCache(
  plugins: rolldown.RolldownPluginOption[],
  options: WithCacheOptions,
): rolldown.RolldownPluginOption {
  const { enabled, sourceExtensions, context } = options;

  if (!enabled) {
    return plugins;
  }

  const includePattern = new RegExp(`\\.(?:${sourceExtensions.join('|')})$`);
  const excludePattern = /@oxc-project\+runtime/;
  let cacheHits = 0;

  const startMarker: rolldown.Plugin = {
    name: 'rollipop:persist-cache-start',
    buildStart() {
      cacheHits = 0;
    },
    buildEnd() {
      this.debug(`Cache hits: ${cacheHits}`);
    },
    load: {
      order: 'pre',
      filter: {
        id: {
          include: includePattern,
          exclude: excludePattern,
        },
      },
      handler(id) {
        const key = getCacheKey(id, context.id);
        const cache = context.cache.get(key);

        if (cache != null) {
          cacheHits++;
          return {
            code: cache,
            moduleType: 'tsx',
            meta: { [CACHE_HIT]: true },
          };
        }
      },
    },
  };

  const endMarker: rolldown.Plugin = {
    name: 'rollipop:persist-cache-end',
    transform: {
      order: 'post',
      filter: {
        id: {
          include: includePattern,
          exclude: excludePattern,
        },
      },
      handler(code, id) {
        const moduleInfo = this.getModuleInfo(id);

        // To avoid the re-caching
        if (!(moduleInfo && isCacheHit(moduleInfo.meta))) {
          const key = getCacheKey(id, context.id);
          context.cache.set(key, code);
        }
      },
    },
  };

  return [startMarker, ...plugins, endMarker];
}

type PersistCachePluginMeta = rolldown.CustomPluginOptions & {
  [CACHE_HIT]: true;
};

function isCacheHit(meta: rolldown.CustomPluginOptions): meta is PersistCachePluginMeta {
  return CACHE_HIT in meta;
}

function getCacheKey(id: string, buildHash: string) {
  const { mtimeMs } = fs.statSync(id);
  return xxhash(`${id}${buildHash}${mtimeMs}`);
}

/**
 * Enhance a plugin to cache the result. (transform hook only)
 */
function cacheable(plugin: rolldown.Plugin) {
  const originalTransform = plugin.transform;

  if (typeof originalTransform === 'function') {
    plugin.transform = function (code, id, meta) {
      const moduleInfo = this.getModuleInfo(id);

      if (moduleInfo && isCacheHit(moduleInfo.meta)) {
        return;
      }

      return originalTransform.call(this, code, id, meta);
    };
  }

  if (typeof originalTransform === 'object') {
    plugin.transform = {
      ...originalTransform,
      handler(code, id, meta) {
        const moduleInfo = this.getModuleInfo(id);

        if (moduleInfo && isCacheHit(moduleInfo.meta)) {
          return;
        }

        return originalTransform.handler.call(this, code, id, meta);
      },
    };
  }

  return plugin;
}

export const PluginUtils = Object.freeze({
  cacheable,
});
