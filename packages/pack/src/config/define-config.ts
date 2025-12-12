import type { DefaultConfig } from './defaults';
import type { Config } from './types';

export interface DefineConfigContext {
  defaultConfig: DefaultConfig;
}

export type UserConfig = Config | DynamicConfig;
export type DynamicConfig =
  | ((context: DefineConfigContext) => Config)
  | ((context: DefineConfigContext) => Promise<Config>);

export function defineConfig(userConfig: UserConfig): UserConfig {
  return userConfig;
}
