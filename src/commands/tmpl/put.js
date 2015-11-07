import Command from '../Command';
import fs from 'fs';

/**
 * Put (create/update) a template.
 * escli tmpl.put --id tmpl_1 --body '{"query": {}}'
 * or
 * escli tmpl.put --id myquery --body_file query.json
 *
 * @ref: http://www.elastic.co/guide/en/elasticsearch/reference/2.1/search-template.html
 * @ref: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-puttemplate-2-1
 **/
export default class tmplPut extends Command {
  static description = 'Create a Template';
  constructor(opts) {
    super(opts);
    this.options = [
      { name: 'id', type: [String], required: true, desc: 'Template ID' },
      { name: 'body', type: [Object], required: false, desc: 'Template body' },
      { name: 'body_file', type: [String], required: false, desc: 'Path to the template body' },
    ];
  }

  run() {
    const { ui, chalk, esc, clidebug } = this;

    const args = this.getCommandArgs();
    if (!args) return;

    const { id, body_file, body, ...rest } = args;

    if (!body_file && !body) {
      return ui.writeLine(chalk.red(`body / body_file must be set`));
    }
    if (body_file && !fs.existsSync(body_file)) {
      return ui.writeLine(chalk.red(`Couldn't find file [${body_file}]`));
    }

    let finalBody;
    if (body_file) {
      finalBody = JSON.parse(fs.readFileSync(body_file, 'utf-8'));
    } else {
      finalBody = body;
    }

    ui.startProgress('Putting Template')

    const options = {
      id,
      body: finalBody
    }

    if (clidebug) {
      ui.writeLine(chalk.cyan(`payload: ${JSON.stringify(options, null, 1)}`))
    }

    esc.putTemplate(options, (err, res) => {
      if (err) return ui.writeLine(chalk.red(err));
      ui.writeLine(chalk.blue(JSON.stringify(res)));
      ui.stopProgress();
    })
  }
}
