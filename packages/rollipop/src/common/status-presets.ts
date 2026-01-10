import chalk from 'chalk';

import { StatusPluginOptions } from '../core/plugins';
import { BundlerContext } from '../core/types';
import { logger } from '../logger';
import { Reporter } from '../types';
import { getBuildTotalModules, setBuildTotalModules } from '../utils/storage';
import { ProgressBarRenderManager } from './progress-bar';

enum ProgressFlags {
  NONE = 0b0000,
  BUILD_IN_PROGRESS = 0b0001,
  FILE_CHANGED = 0b0010,
}

function none(reporter: Reporter): StatusPluginOptions {
  return withReporter(reporter);
}

function compat(reporter: Reporter): StatusPluginOptions {
  return withReporter(reporter, {
    onStart() {
      logger.info('Build started...');
    },
    onEnd({ totalModules, duration, error }) {
      const time = chalk.blue(`${duration.toFixed(2)}ms`);
      const modules = chalk.blue(`(${totalModules} modules)`);

      if (error) {
        logger.error(`Build failed in ${time} ${modules}`);
      } else {
        logger.info(`Build completed in ${time} ${modules}`);
      }
    },
  });
}

function progressBar(
  reporter: Reporter,
  context: BundlerContext,
  label: string,
): StatusPluginOptions {
  let flags = ProgressFlags.NONE;
  const initialTotalModules = getBuildTotalModules(context.storage, context.id);
  const renderManager = ProgressBarRenderManager.getInstance();
  const progressBar = renderManager.register(context.id, {
    label,
    total: initialTotalModules,
  });

  const renderProgress = (
    id: string,
    totalModules: number | undefined,
    transformedModules: number,
  ) => {
    if (totalModules != null) {
      progressBar.setTotal(totalModules);
    }
    progressBar.setCurrent(transformedModules).setModuleId(id);
    renderManager.render();
  };

  return withReporter(reporter, {
    initialTotalModules,
    onStart() {
      flags |= ProgressFlags.BUILD_IN_PROGRESS;
      progressBar.start();
      renderManager.start();
    },
    onEnd({ error, duration, totalModules }) {
      flags = ProgressFlags.NONE;
      progressBar.setTotal(totalModules).complete(duration, Boolean(error));
      renderManager.release();
      setBuildTotalModules(context.storage, context.id, totalModules);
    },
    onTransform({ id, totalModules, transformedModules }) {
      if (flags & ProgressFlags.FILE_CHANGED) {
        logger.debug('Transformed changed file', { id });
        return;
      }
      renderProgress(id, totalModules, transformedModules);
    },
    onWatchChange() {
      flags |= ProgressFlags.FILE_CHANGED;
    },
  });
}

function withReporter(
  reporter: Reporter,
  statusPluginOptions?: StatusPluginOptions,
): StatusPluginOptions {
  return {
    ...statusPluginOptions,
    onStart() {
      reporter.update({ type: 'bundle_build_started' });
      statusPluginOptions?.onStart?.();
    },
    onEnd(result) {
      if (result.error) {
        reporter.update({ type: 'bundle_build_failed', error: result.error });
      } else {
        reporter.update({ type: 'bundle_build_done' });
      }
      statusPluginOptions?.onEnd?.(result);
    },
    onTransform(result) {
      reporter.update({ type: 'transform', ...result });
      statusPluginOptions?.onTransform?.(result);
    },
    onWatchChange(id) {
      reporter.update({ type: 'watch_change', id });
      statusPluginOptions?.onWatchChange?.(id);
    },
  };
}

export const statusPresets = { none, compat, progressBar };
