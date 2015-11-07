import Command from '../Command';

/**
 * Delete an existing index
 * escli indices.del --index main_1
 *
 * @ref: https://www.elastic.co/guide/en/elasticsearch/reference/2.1/indices-delete-index.html
 * @ref: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-indices-delete-2-1
 *
 * TODO: Add support for: settings, mappings, warmers, aliases
 *       currently these can be defined in the mappings command.
 **/
export default class del extends Command {
  static description = 'Delete an exisitng Index';
  constructor(opts) {
    super(opts);
    this.options = [
      { name: 'index', type: [String], required: true, desc: 'The name of the index to delete' }
    ]
  }

  run() {
    const { ui, chalk, esc } = this;

    const args = this.getCommandArgs();
    if (!args) return;

    // Delete the index
    ui.startProgress('Deleting')

    esc.indices.delete(args, (err) => {
      if (err) return ui.writeLine(chalk.red(err));
      ui.writeLine(chalk.blue(`Successfully deleted index [${args.index}]`))
    })
  }
}
