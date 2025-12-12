import type * as rolldown from 'rolldown';

export interface Config {
  root?: string;
  entry?: string;
  resolver?: ResolverConfig;
  transformer?: TransformerConfig;
  serializer?: SerializerConfig;
  reactNative?: ReactNativeConfig;
  INTERNAL__rolldown?: RolldownConfig;
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
  input?: rolldown.InputOption;
  output?: rolldown.OutputOptions;
}
