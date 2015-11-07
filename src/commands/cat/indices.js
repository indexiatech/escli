import Command from '../Command';

/**
 * Provides a cross-section of each index
 * escli cat.indices --index main*
 *
 * @ref: https://www.elastic.co/guide/en/elasticsearch/reference/2.1/cat-indices.html
 * @ref: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-cat-indices-2-1
 **/
export default class indices extends Command {
  static description = 'List indices';
  constructor(opts) {
    super(opts);
    this.options = [
      { name: 'index', type: [String, [String], Boolean], required: false, desc: 'A comma-separated list of index names to limit the returned information' }
    ];
  }

  run() {
    const { ui, chalk, esc } = this;

    const args = this.getCommandArgs();
    if (!args) return;

    // Create the index
    ui.startProgress('Listing')

    esc.cat.indices(args, (err, res) => {
      if (err) return ui.writeLine(chalk.red(err));
      ui.writeLine(chalk.blue(res));
      ui.stopProgress();
    })
  }
}
