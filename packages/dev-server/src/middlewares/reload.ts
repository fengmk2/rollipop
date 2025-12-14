import fp from 'fastify-plugin';

export const reload = fp(
  (fastify) => {
    fastify.all('/reload', (_request, reply) => {
      // TODO: broadcast `reload` command to all connected clients

      reply.status(200).send('OK');
    });
  },
  { name: 'reload' },
);
