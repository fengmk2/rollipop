import type { ResolvedConfig } from '../config';
import { createDevServer, type DevServer, type ServerOptions } from '../server';

export async function runServer(
  config: ResolvedConfig,
  options: ServerOptions,
): Promise<DevServer> {
  const { port, host } = options;
  const devServer = await createDevServer(config, options);

  await devServer.instance.listen({ port, host });

  return devServer;
}
