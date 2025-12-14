import fp from 'fastify-plugin';

export const status = fp(
  (fastify) => {
    const projectRoot = new URL(`file:///${process.cwd()}`).pathname.slice(1);

    fastify.get('/status', (_request, reply) => {
      reply.header('X-React-Native-Project-Root', projectRoot).send('packager-status:running');
    });
  },
  { name: 'status' },
);
