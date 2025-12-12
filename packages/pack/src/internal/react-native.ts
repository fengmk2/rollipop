import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export function getInitializeCorePath(basePath: string) {
  return require.resolve('react-native/Libraries/Core/InitializeCore', { paths: [basePath] });
}

export function getPolyfillScriptPaths(reactNativePath: string) {
  const scriptPath = path.join(reactNativePath, 'rn-get-polyfills');
  return (require(scriptPath) as () => string[])();
}

/**
 * @TODO
 * Before building, collect all the packages required for codegen transformation in the project.
 */
export function getCodegenPackageList(basePath: string) {
  return [];
}
