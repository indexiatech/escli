import Command from '../Command';
import { existsSync, readFileSync } from 'fs';

/**
 * Base command for create & update
 **/
export default class docBase extends Command {
  constructor(opts) {
    super(opts);
    this.options = [
      { name: 'index', type: [String], required: true, desc: 'The name of the index to create/update the doc within' },
      { name: 'type', type: [String], required: true, desc: 'The type of the document' },
      { name: 'id', type: [String], desc: 'Document ID' },
      { name: 'version', type: [Number], desc: 'Explicit version number for concurrency control' },
      { name: 'ttl', type: [String], desc: 'Expiration time for the document.' },
      { name: 'routing', type: [String], desc: 'Specific routing value.' },
      { name: 'body', type: [Object], required: false, desc: 'The document itself.' },
      { name: 'body_file', type: [String], required: false, desc: 'Path to the document file.' },
      { name: 'body_file_source', type: [Boolean], desc: 'Body doc is wrapped with _source' }
    ]
  }

  run() {
    const { ui, chalk, esc } = this;

    const args = this.getCommandArgs();
    if (!args) return;

    const { body, body_file, body_file_source, ...rest } = args;

    if (!body && !body_file) {
      return ui.writeLine(chalk.red(`body / body_file must be set`));
    }

    if (body_file && !existsSync(body_file)) {
      return ui.writeLine(chalk.red(`Couldn't find file [${body_file}]`));
    }

    let finalBody;
    if (body_file) {
      finalBody = JSON.parse(readFileSync(body_file, 'utf-8'));
      if (body_file_source) {
        finalBody = finalBody._source;
      }
    } else {
      finalBody = body;
    }

    rest.body = finalBody;

    this.query(rest);
  }
}
