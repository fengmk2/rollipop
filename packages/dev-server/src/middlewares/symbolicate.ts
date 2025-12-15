import fp from 'fastify-plugin';
import { asConst, type FromSchema } from 'json-schema-to-ts';

const bodySchema = asConst({
  type: 'object',
  properties: {
    stack: {
      type: 'array',
      items: {},
    },
  },
  required: ['stack'],
});

type Body = FromSchema<typeof bodySchema>;

export const symbolicate = fp(
  (fastify) => {
    fastify.post<{ Body: Body }>('/symbolicate', {
      schema: {
        body: bodySchema,
      },
      handler(request, reply) {
        this.log.trace(request.body, 'Symbolicate request');
        reply.status(500).send('Not implemented');
      },
    });
  },
  { name: 'symbolicate' },
);
