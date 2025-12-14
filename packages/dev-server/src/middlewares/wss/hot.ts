import fp from 'fastify-plugin';

export const hot = fp(
  (fastify) => {
    fastify.get('/hot', { websocket: true }, (socket, request) => {
      //
    });
  },
  { name: 'wss-hot' },
);
