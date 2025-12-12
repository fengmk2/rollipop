import path from 'node:path';
import fs from 'node:fs';

export interface PackageJson {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export function getPackageJson(basePath: string) {
  const packageJsonPath = path.join(basePath, 'package.json');
  const rawPackageJson = fs.readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(rawPackageJson) as PackageJson;
}
