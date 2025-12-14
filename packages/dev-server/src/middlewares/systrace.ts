import fs from 'node:fs';
import path from 'node:path';

import { ensureSharedDataPath } from '@rollipop/common';
import type { RouteHandlerMethod } from 'fastify';
import fp from 'fastify-plugin';
import getRawBody from 'raw-body';

import { logger } from '../logger';

export interface SystraceMiddlewareOptions {
  projectRoot: string;
}

export const systrace = fp<SystraceMiddlewareOptions>(
  (fastify, options) => {
    const { projectRoot } = options;

    /**
     * @see https://github.com/react-native-community/cli/blob/20.x/packages/cli-server-api/src/systraceProfileMiddleware.ts
     */
    const impl: RouteHandlerMethod = async (request, reply) => {
      logger.info('Dumping profile information...');

      const sharedDataPath = ensureSharedDataPath(projectRoot);
      const dumpFilePath = path.join(sharedDataPath, `dump_${Date.now()}.json`);

      fs.writeFileSync(dumpFilePath, await getRawBody(request.raw));

      const response =
        `Your profile was saved at:\n${dumpFilePath}\n\n` +
        'On Google Chrome navigate to chrome://tracing and then click on "load" ' +
        'to load and visualise your profile.\n\n' +
        'This message is also printed to your console by the packager so you can copy it :)';

      logger.info(response);

      await reply.status(200).send(response);
    };

    fastify.get('/systrace', impl);
  },
  { name: 'systrace' },
);
