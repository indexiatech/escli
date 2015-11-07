import base from './base';

/**
 * Update parts of a document
 * docs.update --index main_1 --type 'contact' --body '{"hello": "world"}'
 *
 * TODO: Support script type update
 * @ref https://www.elastic.co/guide/en/elasticsearch/reference/2.1/docs-update.html
 * @ref https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-update-2-1
 **/
export default class docsCreate extends base {
  constructor(args) {
    super(args);

    this.options = this.options.map((opt) => {
      if (opt.name === 'id') {
        opt.required = true;
      }

      return opt;
    });
  }
  query(options) {
    const { ui, esc, chalk } = this;

    const { body, ...rest } = options;
    rest.body = {doc: body};

    ui.startProgress('Updating doc')
    esc.update(rest, (err, resp) => {
      if (err) return ui.writeLine(chalk.red(err));
      ui.writeLine(chalk.blue(`Successfully updated document: [${JSON.stringify(resp)}]`))
    });
  }
}
