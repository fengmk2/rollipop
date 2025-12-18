import type * as rolldown from 'rolldown';

export function testPluginDriver(plugin: rolldown.Plugin) {
  const context = {} as any;

  const invokeLoad = (id: string) => {
    if (typeof plugin.load === 'function') {
      return plugin.load.call(context, id);
    }

    if (typeof plugin.load === 'object') {
      return plugin.load.handler.call(context, id);
    }
  };

  const invokeTransform = (code: string, id: string) => {
    if (typeof plugin.transform === 'function') {
      return plugin.transform.call(context, code, id, {} as any);
    }

    if (typeof plugin.transform === 'object') {
      return plugin.transform.handler.call(context, code, id, {} as any);
    }
  };

  return { load: invokeLoad, transform: invokeTransform };
}
