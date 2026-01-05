import { id, include } from '@rolldown/pluginutils';
import type * as rolldown from 'rolldown';
import { viteJsonPlugin } from 'rolldown/experimental';

import { setFlag, TransformFlag } from './utils/transform-flags';

function jsonPlugin(): rolldown.Plugin[] {
  const jsonMarker: rolldown.Plugin = {
    name: 'rollipop:json-marker',
    transform: {
      filter: [include(id(/\.json$/))],
      handler(id) {
        return { meta: setFlag(this, id, TransformFlag.SKIP_ALL) };
      },
    },
  };

  return [jsonMarker, viteJsonPlugin({ namedExports: true })];
}

export { jsonPlugin as json };
