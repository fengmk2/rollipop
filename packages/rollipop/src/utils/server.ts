export function getBaseUrl(host: string, port: number, https?: boolean) {
  return `${https ? 'https' : 'http'}://${host}:${port}`;
}
