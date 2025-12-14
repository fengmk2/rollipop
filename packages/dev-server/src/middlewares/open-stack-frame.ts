import fp from 'fastify-plugin';

export const openStackFrame = fp(
  (fastify) => {
    fastify.post('/open-stack-frame', () => {
      // TODO
    });
  },
  { name: 'open-stack-frame' },
);
