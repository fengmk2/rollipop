import type * as rolldown from 'rolldown';
import { transformCodegenNativeComponent } from 'src/transformer/babel';

export interface CodegenPluginOptions {
  filter: rolldown.HookFilter;
}

export function codegenPlugin(options: CodegenPluginOptions): rolldown.Plugin {
  return {
    name: 'rollipop:codegen',
    transform: {
      filter: options.filter,
      handler(code, id) {
        this.info(`Transforming codegen native component ${id}`);
        return transformCodegenNativeComponent(code, id);
      },
    },
  };
}
