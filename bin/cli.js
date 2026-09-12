#!/usr/bin/env node

import { Command } from 'commander';
import { runShareCommand, runReceiveCommand, runServerCommand } from '../src/index.js';

const program = new Command();

program
  .name('ccs')
  .description('Ultra-fast tool to transfer Claude Code chats between computers via 4-digit PIN code')
  .version('1.0.0');

program
  .command('share', { isDefault: false })
  .description('Select a local Claude Code chat session and get a 4-digit transfer code')
  .option('-s, --server <url>', 'Custom relay server URL')
  .action((options) => runShareCommand(options));

program
  .command('receive [code]')
  .description('Download and import a Claude Code chat session using a 4-digit code')
  .option('-s, --server <url>', 'Custom relay server URL')
  .action((code, options) => runReceiveCommand(code, options));

program
  .command('server')
  .description('Run a local self-hosted relay server')
  .option('-p, --port <number>', 'Port to listen on', '3000')
  .action((options) => runServerCommand(options));

// Smart argument parsing:
// If positional arg is a 4-digit code (e.g. `npx ccs 4829`), automatically run receive command!
const args = process.argv.slice(2);

if (args.length === 1 && /^\d{4}$/.test(args[0])) {
  runReceiveCommand(args[0], {});
} else if (args.length === 0) {
  runShareCommand({});
} else {
  program.parse(process.argv);
}
