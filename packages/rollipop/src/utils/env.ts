import { asLiteral } from '../common/code';

export function defineEnvFromObject<T extends Record<string, string | undefined>>(env: T) {
  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => [`import.meta.env.${key}`, asLiteral(value)]),
  );
}
