import fp from 'fastify-plugin';

export const events = fp(
  (fastify) => {
    fastify.get('/events', { websocket: true }, (socket, request) => {
      //
    });
  },
  { name: 'wss-events' },
);
