import fs from 'node:fs';
import path from 'node:path';

import fp from 'fastify-plugin';

import { getAssetPath } from '../utils/assets';

export const indexPage = fp(
  (fastify) => {
    const indexHtml = fs.readFileSync(path.join(getAssetPath(), 'index.html'));

    fastify.get('/', (_request, reply) => {
      reply.header('Content-Type', 'text/html');
      reply.send(indexHtml);
    });
  },
  { name: 'index-page' },
);
