import fp from 'fastify-plugin';
import { asConst, type FromSchema } from 'json-schema-to-ts';
import open from 'open';

const schema = asConst({
  type: 'object',
  required: ['url'],
  properties: {
    url: {
      type: 'string',
    },
  },
});

type Schema = FromSchema<typeof schema>;

export const openUrl = fp(
  (fastify) => {
    fastify.post<{ Body: Schema }>('/open-url', {
      schema: {
        body: schema,
      },
      async handler(request, reply) {
        const { url } = request.body;

        try {
          const parsedUrl = new URL(url);
          if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            await reply.status(400).send('Invalid URL protocol');
            return;
          }
        } catch (error) {
          this.log.debug(error);
          await reply.status(400).send('Invalid URL format');
          return;
        }

        await open(url);

        await reply.status(200).send();
      },
    });
  },
  { name: 'open-url' },
);
