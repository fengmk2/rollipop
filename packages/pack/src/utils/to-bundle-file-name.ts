import path from 'node:path';

export function toBundleFileName(entry: string, platform: string) {
  const { name } = path.parse(entry);
  return `${name}.bundle.${platform}.js`;
}
