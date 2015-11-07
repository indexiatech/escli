import Command from '../Command';
import fs from 'fs';
import { parallel } from 'async';
import { loadFiles } from '../../utils/files';

/**
 * Like `put` command but as a bulk
 *
 * escli tmpl.putBulk --dir queries
 **/
export default class tmplPut extends Command {
  static description = 'Create a Template';
  constructor(opts) {
    super(opts);
    this.options = [
      { name: 'dir', type: [String], required: true, desc: 'Path to a directory that contains all templates' },
      { name: 'prefix', type: [String], required: false, desc: 'static prefix for all template ids.' }
    ];
  }

  run() {
    const { ui, chalk, esc, clidebug } = this;

    const args = this.getCommandArgs();
    if (!args) return;

    const { id, dir, prefix, ...rest } = args;

    if (dir && !fs.existsSync(dir)) {
      return ui.writeLine(chalk.red(`Couldn't find directory [${dir}]`));
    }

    ui.startProgress('Putting Templates')

    // Load all JSON mappings
    loadFiles(`${dir}/*/*.json`, true, true, (err, templates) => {
      const queries = [];
      templates.forEach((tmpl) => {
        queries.push((cb) => {
          const tmplId = (prefix || '') + tmpl.name.substring(tmpl.name.indexOf('/') + 1).slice(0, 'json.'.length * -1);
          const options = {
            id: tmplId,
            body: tmpl.value
          }

          if (clidebug) {
            ui.writeLine(chalk.cyan(`template payload: ${JSON.stringify(options, null, 1)}`))
          }

          esc.putTemplate(options, cb);
        });
      });

      parallel(queries, (err, res) => {
        if (err) {
          ui.writeLine(chalk.red(JSON.stringify(err)));
        } else {
          res.forEach((currResp) => {
            ui.writeLine(chalk.blue(`Status: ${currResp[1]}, result: ${JSON.stringify(currResp[0])}`));
          })
        }
      });
    });
  }
}
