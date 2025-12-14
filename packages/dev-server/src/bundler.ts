import { type BuildOptions, Bundler, type ResolvedConfig } from '@rollipop/pack';

export class InstanceManager {
  private readonly bundlers: Map<string, Bundler> = new Map();

  constructor(private readonly config: ResolvedConfig) {}

  private getKey(bundleName: string, buildOptions: BuildOptions) {
    const id = Bundler.getId(this.config, buildOptions);
    return `${bundleName}-${id}`;
  }

  getBundler(bundleName: string, buildOptions: BuildOptions) {
    const key = this.getKey(bundleName, buildOptions);
    const bundler = this.bundlers.get(key);

    if (bundler) {
      return bundler;
    } else {
      const bundler = new Bundler(this.config);
      this.bundlers.set(key, bundler);
      return bundler;
    }
  }
}
