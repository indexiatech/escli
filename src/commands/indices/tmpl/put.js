import Command from '../../Command';
import { waterfall } from 'async';
import { loadFilesAndMerge } from '../../../utils/files';
import fs from 'fs';

/**
 * Put (Create/Update) an index template that will automatically be applied to new indices created
 * escli indices.tmpl.put --name hello --template hello_* --mappings_dir mappings --settings '{"analysis": {"analyzer": {"paths": {"tokenizer": "path_hierarchy"}}}}'
 *
 * @ref: https://www.elastic.co/guide/en/elasticsearch/reference/2.1/indices-templates.html
 * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-indices-puttemplate-2-1
 *
 **/
export default class putIdxTmpl extends Command {
  static description = 'Create a new Index-Template.';
  constructor(opts) {
    super(opts);
    this.options = [
      { name: 'name', type: [String], required: true, desc: 'The name of the index template to create' },
      { name: 'template', type: [String], required: true, desc: 'Name of indices that should apply this mapping, i.e myapp_*' },
      { name: 'settings', type: [Object], required: false, desc: 'Extra settings.' },
      { name: 'aliases', type: [Object], required: false, desc: 'Index aliases.' },
      { name: 'mappings_dir', type: [String], required: false, desc: 'Path to the folder that contains the mapping files.' }
    ]
  }

  run() {
    const { ui, chalk, esc, clidebug } = this;
    ui.startProgress('Putting index template');

    const args = this.getCommandArgs();
    if (!args) return;

    const { name, mappings_dir, ...body } = args;

    if (mappings_dir && !fs.existsSync(mappings_dir)) {
      return ui.writeLine(chalk.red(`Couldn't find directory name [${mappings_dir}]`));
    }

    waterfall([
      // Load all JSON mappings
      (cb) => {
        loadFilesAndMerge(`${mappings_dir}/*.json`, cb)
      }, (mappings, cb) => {
        body.mappings = mappings;
        const finalBody = {
          name,
          body
        }

        if (clidebug) {
          ui.writeLine(chalk.cyan(`payload: ${JSON.stringify(finalBody, null, 1)}`))
        }
        esc.indices.putTemplate({
          name: name,
          body
        }, cb);
      }, (res, code) => {
        if (code !== 200 || !res.acknowledged) {
          (ui.writeLine(chalk.red(JSON.stringify(res))));
        } else {
          ui.writeLine(chalk.blue(`Successfully put template [${name}]`))
        }
      }
    ]);
  }
}
