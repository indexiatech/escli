import yargs from 'yargs';
import UI from './ui';
import * as commands from './commands';
import { get, set } from 'lodash';
import flatten from 'flat';
import chalk from 'chalk';

const ui = new UI({
  inputStream: process.stdin,
  outputStream: process.stdout,
  ci: process.env.CI || /^(dumb|emacs)$/.test(process.env.TERM),
  writeLevel: ~process.argv.indexOf('--silent') ? 'ERROR' : undefined
});

const ElasticSearch = require('elasticsearch');
// TODO: Extract to config
const esc = new ElasticSearch.Client({
  host: 'http://localhost:9200'
});

function spaces(length) {
  let str = '';
  for (let i = 0; i < length ; i++) {
    str += ' ';
  }

  return str;
}

function showAllCommandsHelp() {
  const cmds = Object.keys(flatten(commands));
  cmds.forEach((k) => {
    const cmd = get(commands, k);
    ui.writeLine(`${chalk.green(k)}${spaces(30-k.length)}${chalk.gray(cmd.description)}`);
  })
}

const argv = yargs.argv;
const commandName = argv._[0];

const cmd = get(commands, commandName);

if (cmd) {
  const command = new cmd({
    argv,
    ui,
    chalk,
    esc
  });
  command._run();
} else {
  // we can't find this command, lets show global help
  showAllCommandsHelp()
}
