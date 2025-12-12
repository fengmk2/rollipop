import type * as rolldown from 'rolldown';

export interface Config {
  root?: string;
  entry?: string;
  resolver?: ResolverConfig;
  transformer?: TransformerConfig;
  serializer?: SerializerConfig;
  reactNative?: ReactNativeConfig;
  plugins?: rolldown.Plugin[];
  INTERNAL__rolldown?:
    | RolldownConfig
    | ((config: RolldownConfig) => RolldownConfig)
    | ((config: RolldownConfig) => Promise<RolldownConfig>);
}

export interface ResolverConfig {
  sourceExtensions?: string[];
  assetExtensions?: string[];
  mainFields?: string[];
  conditionNames?: string[];
  preferNativePlatform?: boolean;
}

export interface TransformerConfig {
  flow?: FlowConfig;
}

export interface FlowConfig {
  filter?: rolldown.HookFilter;
}

export interface SerializerConfig {
  prelude?: string[];
  polyfills?: string[];
}

export interface ReactNativeConfig {
  assetRegistryPath?: string;
  codegen?: CodegenConfig;
}

export interface CodegenConfig {
  filter?: rolldown.HookFilter;
}

export interface RolldownConfig {
  input?: rolldown.InputOptions;
  output?: rolldown.OutputOptions;
}
