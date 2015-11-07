import Command from '../Command';

/**
 * Return documents matching a query, aggregations/facets, highlighted snippets, suggestions, and more.
 * escli doc.search --index main_1 --type contact -q 'hello:worl*'
 * or
 * --query '{"match": {"name": "world"}}'
 *
 * @ref: http://www.elastic.co/guide/en/elasticsearch/reference/2.1/search-search.html
 * @ref: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-search-2-1
 *
 **/
export default class docsSearch extends Command {
  static description = 'Search for documents.';
  constructor(opts) {
    super(opts);
    this.options = [
      { name: 'index', type: [String], required: false, desc: 'The name of the index.' },
      { name: 'type', type: [String], required: false, desc: 'The type of the document.' },
      { name: 'q', type: [String], required: false, desc: 'Query in the Lucene query string syntax.' },
      { name: 'query', type: [Object], required: false, desc: 'Query in Elasticsearch Query DSL.' },
      { name: 'size', type: [Number], required: false, desc: 'Number of hits to return (default: 10)' },
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

    const { query, compact, ...rest } = args;

    if (query) {
      rest.body = {
        query
      }
    }

    ui.startProgress('Getting document')

    esc.search(rest, (err, res) => {
      if (err) return ui.writeLine(chalk.red(err));
      if (compact) {
        ui.writeLine(chalk.blue(this.compact(res)));
      } else {
        ui.writeLine(chalk.blue(JSON.stringify(res, null, 2)));
      }
    })
  }
}
