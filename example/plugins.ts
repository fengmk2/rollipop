import * as babel from '@babel/core';
import type { Plugin } from 'rollipop';

const REANIMATED_AUTOWORKLETIZATION_KEYWORDS = [
  'worklet',
  'useAnimatedGestureHandler',
  'useAnimatedScrollHandler',
  'useFrameCallback',
  'useAnimatedStyle',
  'useAnimatedProps',
  'createAnimatedPropAdapter',
  'useDerivedValue',
  'useAnimatedReaction',
  'useWorkletCallback',
  'withTiming',
  'withSpring',
  'withDecay',
  'withRepeat',
  'runOnUI',
  'executeOnUIRuntimeSync',
];

const REANIMATED_REGEX = new RegExp(REANIMATED_AUTOWORKLETIZATION_KEYWORDS.join('|'));

export function worklet(): Plugin {
  return {
    name: 'worklet',
    transform: {
      filter: {
        code: REANIMATED_REGEX,
        id: [/react-native-reanimated/, /react-native-worklets/],
      },
      handler(code, id) {
        const result = babel.transformSync(code, {
          filename: id,
          babelrc: false,
          configFile: false,
          sourceMaps: true,
          presets: [
            [
              require.resolve('@babel/preset-typescript'),
              {
                isTSX: id.endsWith('x'),
                allExtensions: true,
              },
            ],
          ],
          plugins: [[require.resolve('react-native-worklets/plugin'), {}]],
        });

        if (result?.code == null) {
          throw new Error(`Failed to transform worklet: ${id}`);
        }

        return { code: result.code, map: result.map };
      },
    },
  };
}
