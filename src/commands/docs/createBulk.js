import Command from '../Command';
import fs from 'fs';
import { parallel } from 'async';
import { loadFiles } from '../../utils/files';

/**
 * Like `create` command but as a bulk
 *
 * escli docs.createBulk --dir init_data/app/ --index main
 **/
export default class tmplCreateBulk extends Command {
  static description = 'Create documents in a bulk';
  constructor(opts) {
    super(opts);
    this.options = [
      { name: 'dir', type: [String], required: true, desc: 'Path to a directory that contains all templates' },
      { name: 'index', type: [String], required: false, desc: 'Default index to update the docs within' },
      { name: 'update', type: [String], required: false, desc: 'Update instad of create' }
      // { name: 'index', type: [String], required: false, desc: 'Default index to update the docs within' }
    ];
  }

  debugPayload(payload) {
    this.ui.writeLine(this.chalk.cyan(`payload: ${JSON.stringify(payload, null, 1)}`))
  }

  run() {
    const { ui, chalk, esc, clidebug } = this;

    const args = this.getCommandArgs();
    if (!args) return;

    const { dir, index, update, ...rest } = args;

    if (dir && !fs.existsSync(dir)) {
      return ui.writeLine(chalk.red(`Couldn't find directory [${dir}]`));
    }

    ui.startProgress('Creating documents')

    // Load all JSON mappings
    loadFiles(`${dir}/**/*.json`, true, true, (err, docs) => {
      if (docs.length === 0) {
        return ui.writeLine(chalk.grey('No docs found.'));
      }
      const queries = [];
      docs.forEach((doc) => {
        queries.push((cb) => {
          const { value } = doc;
          const { _id, type, index = args.index, _source } = value;

          const payload = {
            id: _id,
            type,
            index
          }

          if (payload.id) {
            if (update) {
              payload.body = {
                doc: _source
              }
              if (clidebug) {
                this.debugPayload(payload);
              }
              esc.update(payload, cb);
            } else {
              payload.body = _source;
              if (clidebug) {
                this.debugPayload(payload);
              }
              esc.create(payload, cb);
            }
          } else {
            payload.body = _source;
            if (clidebug) {
              this.debugPayload(payload);
            }
            esc.create(payload, cb);
          }
        });
      });

      parallel(queries, (err, res) => {
        if (err) {
          ui.writeLine(chalk.red(err));
        } else {
          res.forEach((currResp) => {
            ui.writeLine(chalk.blue(`Status: ${currResp[1]}, result: ${JSON.stringify(currResp[0])}`));
          })
        }
      });
    });
  }
}
