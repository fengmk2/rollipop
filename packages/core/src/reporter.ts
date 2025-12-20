import { Logger } from '@rollipop/common';

import type { Reporter, ReportableEvent } from './types';

export class TerminalReporter implements Reporter {
  private logger = new Logger('app');

  update(event: ReportableEvent): void {
    if (event.type === 'client_log') {
      if (event.level === 'group' || event.level === 'groupCollapsed') {
        this.logger.info(...event.data);
        return;
      } else if (event.level === 'groupEnd') {
        return;
      }
      this.logger[event.level](...event.data);
    }
  }
}
