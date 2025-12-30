import { program } from '@commander-js/extra-typings';

import { version } from '../../package.json' with { type: 'json' };
import { Logo } from '../common/logo';
import { command as bundleCommand } from './commands/bundle';
import { command as startCommand } from './commands/start';

export function run(argv: string[]) {
  Logo.printOnce();

  const cli = program.name('rollipop').version(version);

  cli.addCommand(bundleCommand);
  cli.addCommand(startCommand);

  cli.parse(argv);
}
