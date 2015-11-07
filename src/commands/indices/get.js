import Command from '../Command';

/**
 * Get an existing index
 * escli indices.get --index main_1
 *
 * @ref: https://www.elastic.co/guide/en/elasticsearch/reference/2.1/indices-get-index.html
 * @ref: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-indices-get-2-1
 *
 * TODO: Add support for: settings, mappings, warmers, aliases
 *       currently these can be defined in the mappings command.
 **/
export default class get extends Command {
  static description = 'Get an existing index.';
  constructor(opts) {
    super(opts);
    this.options = [
      { name: 'index', type: [String, [String], Boolean], required: true, desc: 'List of index names' }
    ]
  }

  run() {
    const { ui, chalk, esc } = this;

    const args = this.getCommandArgs();
    if (!args) return;

    // Create the index
    ui.startProgress('Getting')

    esc.indices.get(args, (err, res) => {
      if (err) return ui.writeLine(chalk.red(err));
      ui.writeLine(chalk.blue(JSON.stringify(res, null, 2)));
    });
  }
}
