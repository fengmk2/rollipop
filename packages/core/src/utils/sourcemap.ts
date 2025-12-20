import remapping, { SourceMapInput } from '@jridgewell/remapping';

export function combineSourceMaps(maps: SourceMapInput[]) {
  return remapping(maps, () => null);
}
