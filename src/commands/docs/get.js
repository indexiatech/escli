import Command from '../Command';

/**
 * Get a typed JSON document from the index based on its id.
 * escli doc.get --index main_1 --type contact --id 1
 *
 * @ref: https://www.elastic.co/guide/en/elasticsearch/reference/2.1/docs-get.html
 * @ref: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-get-2-1
 *
 **/
export default class docsGet extends Command {
  static description = 'Delete an exisitng Index';
  constructor(opts) {
    super(opts);
    this.options = [
      { name: 'index', type: [String], required: true, desc: 'The name of the index.' },
      { name: 'type', type: [String], required: true, desc: 'The type of the document.' },
      { name: 'id', type: [String], required: true, desc: 'The document ID.' }
    ]
  }

  run() {
    const { ui, chalk, esc } = this;

    const args = this.getCommandArgs();
    if (!args) return;

    ui.startProgress('Getting document')

    esc.get(args, (err, res) => {
      if (err) return ui.writeLine(chalk.red(err));
      ui.writeLine(chalk.blue(JSON.stringify(res)))
    })
  }
}
