export default class Command {
  constructor({argv, ui, chalk, esc}) {
    this.argv = argv;
    this.ui = ui;
    this.chalk = chalk;
    this.esc = esc;
    this.clidebug = !!argv.clidebug;
    delete argv.clidebug;
  }

  _run() {
    this.run();
  }

  run() {
    throw new Error('run() must be implemented.');
  }

  normalize (opt, val) {
    if (val && opt.type.indexOf(Object) > -1) {
      return JSON.parse(val);
    } else {
      return val;
    }
  }

  getCommandArgs() {
    const { _, $0, v, ...rest} = this.argv;

    if (rest.showHelp) {
      this.showHelp();
      return;
    }

    const finalArgs = {};
    try {
      this.options.forEach((opt) => {
        if (opt.required && !rest[opt.name]) {
          throw Error(`${opt.name} is required.`);
        }

        const val = this.normalize(opt, rest[opt.name]);
        if (val) {
          finalArgs[opt.name] = val;
        }
      })
    } catch (e) {
      this.ui.writeLine(this.chalk.red(e));
      this.showHelp();
      return;
    }

    return finalArgs;
  }

  showHelp() {
    const { options, ui, chalk} = this;
    const parsedOpts = this.options.map((opt) => {
      let str = `--${opt.name}`;

      if (opt.aliases && opt.aliases.length > 0) {
        str += ', ';
        opt.aliases.forEach((alias) => str += `-${alias}`);
      }

      str += "\t\t";
      str += chalk.grey(opt.desc);

      return chalk.green(str);
    });

    parsedOpts.forEach((opt) => ui.writeLine(opt));
  }
}