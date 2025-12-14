import { isDebugEnabled } from '@rollipop/common';
import type { ResolvedConfig } from '@rollipop/pack';
import Fastify from 'fastify';

import { InstanceManager } from './bundler';
import { DEFAULT_HOST, DEFAULT_PORT } from './constants';
import { errorHandler } from './error';
import { DevServerLogger } from './logger';
import { indexPage } from './middlewares/index-page';
import { noCache } from './middlewares/no-cache';
import { openStackFrame } from './middlewares/open-stack-frame';
import { openUrl } from './middlewares/open-url';
import { securityHeaders } from './middlewares/security-headers';
import { serveAssets } from './middlewares/serve-assets';
import { serveBundle, type ServeBundlePluginOptions } from './middlewares/serve-bundle';
import { status } from './middlewares/status';
import { symbolicate } from './middlewares/symbolicate';
import { systrace } from './middlewares/systrace';
import type { ServerOptions } from './types';

export async function runServer(config: ResolvedConfig, options: ServerOptions) {
  const { projectRoot, port = DEFAULT_PORT, host = DEFAULT_HOST, https = false } = options;

  if (https) {
    throw new Error('HTTPS is not supported yet');
  }

  const fastify = Fastify({
    requestTimeout: 60_000,
    disableRequestLogging: !isDebugEnabled(),
    loggerInstance: new DevServerLogger(),
  });

  const instanceManager = new InstanceManager(config);
  const serveBundleOptions: ServeBundlePluginOptions = {
    getBundler: (bundleName, buildOptions) => {
      return instanceManager.getBundler(bundleName, buildOptions);
    },
  };

  fastify
    .register(securityHeaders, { host })
    .register(import('@fastify/compress'))
    .register(import('@fastify/websocket'))
    .register(noCache)
    .register(openUrl)
    .register(openStackFrame)
    .register(symbolicate)
    .register(indexPage)
    .register(status)
    .register(serveBundle, serveBundleOptions)
    .register(serveAssets, { projectRoot, host, port, https })
    .register(systrace, { projectRoot })
    .setErrorHandler(errorHandler);

  return fastify.listen({ port, host });
}
