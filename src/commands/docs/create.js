import base from './base';

/**
 * Adds a typed JSON document in a specific index, making it searchable.
 * If a document with the same index, type, and id already exists, an error will occur.
 * docs.create --index main_1 --type 'contact' --body '{"hello": "world"}'
 *
 * @ref https://www.elastic.co/guide/en/elasticsearch/reference/2.1/docs-index_.html
 * @ref https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-create-2-1
 **/
export default class docsCreate extends base {
  query(options) {
    const { ui, esc, chalk } = this;

    ui.startProgress('Creating doc')
    esc.create(options, (err, resp) => {
      if (err) return ui.writeLine(chalk.red(err));
      ui.writeLine(chalk.blue(`Successfully created document: [${JSON.stringify(resp)}]`))
    });
  }
}
