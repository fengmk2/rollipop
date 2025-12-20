import type { ReportableEvent, Reporter } from '@rollipop/dev-server';

import { logger } from './logger';

export class TerminalReporter implements Reporter {
  update(event: ReportableEvent): void {
    if (event.type === 'client_log') {
      if (event.level === 'group' || event.level === 'groupCollapsed') {
        logger.info(...event.data);
        return;
      } else if (event.level === 'groupEnd') {
        return;
      }
      logger[event.level](...event.data);
    }
  }
}
