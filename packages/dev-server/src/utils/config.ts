import EventEmitter from 'node:events';

import { Reporter, ResolvedConfig } from '@rollipop/core';

import { BundlerDevEngineEventMap } from '../bundler-pool';

export function bindReporter(
  config: ResolvedConfig,
  eventSource: EventEmitter<BundlerDevEngineEventMap>,
): ResolvedConfig {
  const originalReporter = config.reporter;
  const reporter: Reporter = {
    update(event) {
      switch (event.type) {
        case 'bundle_build_started':
          eventSource.emit('buildStart');
          break;

        case 'bundle_build_done':
          eventSource.emit('buildDone');
          break;

        case 'bundle_build_failed':
          eventSource.emit('buildFailed', event.error);
          break;

        case 'transform':
          eventSource.emit('transform', event.id, event.totalModules, event.transformedModules);
          break;

        case 'watch_change':
          eventSource.emit('watchChange', event.id);
          break;
      }
      originalReporter.update(event);
    },
  };

  config.reporter = reporter;

  return config;
}
