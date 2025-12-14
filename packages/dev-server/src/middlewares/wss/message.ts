import fp from 'fastify-plugin';

export const hot = fp(
  (fastify) => {
    fastify.get('/message', { websocket: true }, (socket, request) => {
      //
    });
  },
  { name: 'wss-message' },
);
