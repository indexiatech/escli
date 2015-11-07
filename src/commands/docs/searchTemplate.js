import Command from '../Command';

// TODO: very similar with search, we can have a baseline for both

/**
 * Same as `search` but search by query template.
 * escli docs.st --template_id app@query_by_name --params '{"name": "world"}'
 *
 * @ref: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-template.html
 * @ref: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-searchtemplate-2-1
 *
 **/
export default class docsGet extends Command {
  static description = 'Search for documents by (query) template.';
  constructor(opts) {
    super(opts);
    this.options = [
      { name: 'index', type: [String], required: false, desc: 'The name of the index.' },
      { name: 'type', type: [String], required: false, desc: 'The type of the document.' },
      { name: 'template_id', type: [String], required: true, desc: 'The query template ID.' },
      { name: 'params', type: [Object], required: true, desc: 'The query template param values.' },
      { name: 'compact', type: [Boolean], required: false, desc: 'Display in a compact mode.' },
    ]
  }

  compact(res) {
    let str = `Summary: total[${res.hits.total}], max_score[${res.hits.max_score}], timeout[${res.timed_out}]`;
    for (let i = 0; i < res.hits.total; i++) {
      str += `\n${i + 1} ${JSON.stringify(res.hits.hits[i])}`;
    }
    return str;
  }

  run() {
    const { ui, chalk, esc } = this;

    const args = this.getCommandArgs();
    if (!args) return;

    const { compact, template_id, params, ...rest } = args;

    const options = {
      ...rest,
      body: {
        template: {
          id: template_id
        },
        params: params
      }
    }

    ui.startProgress('Getting document')

    esc.searchTemplate(options, (err, res) => {
      if (err) return ui.writeLine(chalk.red(err));
      if (compact) {
        ui.writeLine(chalk.blue(this.compact(res)));
      } else {
        ui.writeLine(chalk.blue(JSON.stringify(res, null, 2)));
      }
    })
  }
}
