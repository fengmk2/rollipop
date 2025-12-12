import path from 'node:path';

export function getInitializeCorePath(basePath: string) {
  return require.resolve('react-native/Libraries/Core/InitializeCore', { paths: [basePath] });
}

export function getPolyfillScriptPaths(reactNativePath: string) {
  const scriptPath = path.join(reactNativePath, 'rn-get-polyfills');
  return (require(scriptPath) as () => string[])();
}
