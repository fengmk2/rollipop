import type { onRequestHookHandler } from 'fastify';
import fp from 'fastify-plugin';

export interface SecurityHeadersMiddlewareOptions {
  host: string;
}

export const securityHeaders = fp<SecurityHeadersMiddlewareOptions>(
  (fastify, options) => {
    const { host } = options;

    /**
     * @see https://github.com/react-native-community/cli/blob/20.x/packages/cli-server-api/src/securityHeadersMiddleware.ts
     */
    const impl: onRequestHookHandler = (request, reply, next) => {
      if (
        typeof request.headers.origin === 'string' &&
        !request.headers.origin.match(new RegExp('^https?://' + host + ':')) &&
        !request.headers.origin.startsWith('devtools://devtools')
      ) {
        next(
          new Error(
            'Unauthorized request from ' +
              request.headers.origin +
              '. This may happen because of a conflicting browser extension. Please try to disable it and try again.',
          ),
        );
        return;
      }

      // Block MIME-type sniffing.
      reply.header('X-Content-Type-Options', 'nosniff');
      next();
    };

    fastify.addHook('onRequest', impl);
  },
  { name: 'security-headers' },
);
