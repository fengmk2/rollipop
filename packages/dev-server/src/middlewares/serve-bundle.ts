import type { BuildOptions, Bundler } from '@rollipop/pack';
import fp from 'fastify-plugin';
import { asConst, FromSchema } from 'json-schema-to-ts';

const routeParamSchema = asConst({
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },
});

const queryParamSchema = asConst({
  type: 'object',
  properties: {
    platform: {
      type: 'string',
    },
    app: {
      type: 'string',
    },
    dev: {
      type: 'boolean',
    },
    minify: {
      type: 'boolean',
    },
    runModule: {
      type: 'boolean',
    },
    inlineSourceMap: {
      type: 'boolean',
    },
    modulesOnly: {
      type: 'boolean',
    },
  },
  required: ['platform'],
});

type RouteParams = FromSchema<typeof routeParamSchema>;
type QueryParams = FromSchema<typeof queryParamSchema>;

export interface ServeBundlePluginOptions {
  getBundler: (bundleName: string, buildOptions: BuildOptions) => Bundler | null;
}

export const serveBundle = fp<ServeBundlePluginOptions>(
  (fastify, options) => {
    const { getBundler } = options;

    fastify.get<{ Params: RouteParams; Querystring: QueryParams }>('/:name.bundle', {
      schema: {
        params: routeParamSchema,
        querystring: queryParamSchema,
      },
      async handler(request, reply) {
        const { params, query } = request;

        if (!params.name) {
          await reply.status(400).send('invalid bundle name');
          return;
        }

        const bundler = getBundler(params.name, query);

        if (bundler) {
          // TODO: watch mode
          const chunk = await bundler.build(query);

          await reply
            .header('Content-Type', 'application/javascript')
            .header('Content-Length', Buffer.byteLength(chunk.code))
            .status(200)
            .send(chunk.code);
        } else {
          await reply.status(404).send('bundle not found');
        }
      },
    });

    fastify.get<{ Params: RouteParams; Querystring: QueryParams }>('/:name.map', {
      schema: {
        params: routeParamSchema,
        querystring: queryParamSchema,
      },
      async handler(request, reply) {
        const { params, query } = request;

        if (!params.name) {
          await reply.status(400).send('invalid bundle name');
          return;
        }

        const bundler = getBundler(params.name, query);

        if (bundler) {
          // TODO: serve sourcemap
          fastify.log.trace('Bundler found');
          await reply
            .header('Access-Control-Allow-Origin', 'devtools://devtools')
            .status(404)
            .send('bundle not found');
        } else {
          await reply.status(404).send('bundle not found');
        }
      },
    });
  },
  { name: 'serve-bundle' },
);
