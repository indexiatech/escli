import Command from '../Command';

/**
 * Create an index
 * escli indices.create --index main_1
 *
 * @ref: https://www.elastic.co/guide/en/elasticsearch/reference/2.1/indices-create-index.html
 * @ref: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-indices-create-2-1
 *
 * TODO: Add support for: settings, mappings, warmers, aliases
 *       currently these can be defined in the mappings command.
 **/
export default class create extends Command {
  static description = 'Create a new Index';
  constructor(opts) {
    super(opts);
    this.options = [
      { name: 'index', type: [String], required: true, desc: 'The name of the index to create' }
    ]
  }

  run() {
    const { ui, chalk, esc } = this;

    const args = this.getCommandArgs();
    if (!args) return;

    // Create the index
    ui.startProgress('Creating')

    esc.indices.create(args, (err) => {
      if (err) return ui.writeLine(chalk.red(err));
      ui.writeLine(chalk.blue(`Successfully created index [${args.index}]`))
    });
  }
}
