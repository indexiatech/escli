import Command from '../../Command';

/**
 * Get an existing index template
 * escli indices.tmpl.get --name main* --compact
 *
 * @ref: https://www.elastic.co/guide/en/elasticsearch/reference/2.1/indices-templates.html
 * @ref: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-indices-gettemplate-2-1
 *
 **/
export default class getIdxTmpl extends Command {
  static description = 'Get an existing Index-Template';
  constructor(opts) {
    super(opts);
    this.options = [
      { name: 'name', type: [String, [String], Boolean], desc: 'The comma separated names of the index templates' },
      { name: 'compact', type: [String], desc: 'Get only minimal data about index templates' }
    ]
  }

  compact (res) {
    let str = '';

    Object.keys(res).forEach((k) => {
      const doc = res[k];
      str += `name: ${k}, template: ${doc.template} \n`
    });

    return str;
  }

  run() {
    const { ui, chalk, esc } = this;

    const args = this.getCommandArgs();
    if (!args) return;

    const { compact, ...restArgs } = args;

    ui.startProgress('Get Index Template')
    esc.indices.getTemplate(restArgs, (err, res) => {
      if (err) return ui.writeLine(chalk.red(err));

      if (compact) {
        ui.writeLine(chalk.blue(this.compact(res)));
      } else {
        ui.writeLine(chalk.blue(JSON.stringify(res, null, 2)));
      }

      ui.stopProgress();
    })
  }
}
