import Command from '../../Command';

/**
 * Delete an existing index template
 * escli indices.tmpl.del --name main_tmpl
 *
 * @ref: https://www.elastic.co/guide/en/elasticsearch/reference/2.1/indices-templates.html
 * @ref: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-indices-deletetemplate-2-1
 *
 **/
export default class delIdxTmpl extends Command {
  static description = 'Delete an existing Index-Template';
  constructor(opts) {
    super(opts);
    this.options = [
      { name: 'name', type: [String], required: true, desc: 'The name of the index template to delete' }
    ]
  }

  run() {
    const { ui, chalk, esc } = this;
    const args = this.getCommandArgs();
    if (!args) return;

    // Delete the index
    ui.startProgress('Deleting Index Template')
    esc.indices.deleteTemplate(args, (err) => {
      if (err) return ui.writeLine(chalk.red(err));
      ui.writeLine(chalk.blue(`Successfully deleted index template [${args.name}]`))
    })
  }
}
