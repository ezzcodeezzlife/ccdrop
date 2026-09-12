import { select, input } from '@inquirer/prompts';
import chalk from 'chalk';
import boxen from 'boxen';

/**
 * Format and render interactive select prompt with clean aligned columns
 */
export async function selectSessionPrompt(sessions) {
  if (!sessions || sessions.length === 0) {
    console.log(chalk.yellow('Warning: No Claude Code chat sessions found in ~/.claude/projects/'));
    return null;
  }

  const termWidth = process.stdout.columns || 80;

  const choices = sessions.map(s => {
    const cleanTitle = (s.title || '').replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
    const projTag = `[${s.projectName}]`;

    const dateStr = new Date(s.updatedAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
    const sizeKb = (s.fileSizeBytes / 1024).toFixed(0);
    const metaStr = `${dateStr} | ${s.messageCount} msgs | ${sizeKb}KB`;

    const reservedWidth = 18 + metaStr.length + 8;
    const maxTitleLen = Math.max(20, termWidth - reservedWidth);
    const truncatedTitle = cleanTitle.length > maxTitleLen
      ? cleanTitle.slice(0, maxTitleLen - 3) + '...'
      : cleanTitle;

    const tagPadded = projTag.length > 16 ? projTag.slice(0, 15) + ']' : projTag.padEnd(16);
    const titlePadded = truncatedTitle.padEnd(maxTitleLen);

    const formattedName = `${chalk.cyan(tagPadded)} ${chalk.white(titlePadded)} ${chalk.dim(metaStr)}`;

    return {
      name: formattedName,
      value: s
    };
  });

  try {
    const selected = await select({
      message: 'Select a Claude chat session to share:',
      choices,
      pageSize: 10
    });
    return selected;
  } catch (err) {
    process.exit(0);
  }
}

export function displayTransferCode(code, serverUrl) {
  const boxContent = [
    chalk.bold.white('Transfer Code:'),
    '',
    chalk.bold.cyan(`    ${code}    `),
    '',
    chalk.dim('Run on destination PC:'),
    chalk.green.bold(`npx ccdrop ${code}`),
    '',
    chalk.yellow('Code expires in 15 mins or after 1 download.')
  ].join('\n');

  console.log('\n' + boxen(boxContent, {
    padding: 1,
    margin: 0,
    borderStyle: 'round',
    borderColor: 'cyan'
  }));
}

export async function promptForCode() {
  try {
    const code = await input({
      message: 'Enter 4-digit transfer code:',
      validate: (val) => {
        if (!val || val.trim().length !== 4 || isNaN(Number(val.trim()))) {
          return 'Please enter a valid 4-digit numeric code.';
        }
        return true;
      }
    });
    return code.trim();
  } catch (err) {
    process.exit(0);
  }
}
