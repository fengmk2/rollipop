import fp from 'fastify-plugin';

export const noCache = fp(
  (fastify) => {
    fastify.addHook('onSend', (_request, reply, _payload, next) => {
      reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      reply.header('Surrogate-Control', 'no-store');
      reply.header('Pragma', 'no-cache');
      reply.header('Expires', '0');
      next();
    });
  },
  { name: 'no-cache' },
);
