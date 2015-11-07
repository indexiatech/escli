import PleasantProgress from 'pleasant-progress';
const EOL = require('os').EOL;
import writeError from './write-error';
import through from 'through';

const WRITE_LEVELS = {
  'DEBUG': 1,
  'INFO': 2,
  'WARNING': 3,
  'ERROR': 4
};

/*
  The UI provides the CLI with a unified mechanism for providing output and
  requesting input from the user. This becomes useful when wanting to adjust
  logLevels, or mock input/output for tests.

  new UI({
    inputStream: process.stdin,
    outputStream: process.stdout,
    writeLevel: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR',
    ci: true | false
  });
 */
export default class UI {
  constructor(options) {
    const pleasantProgress = this.pleasantProgress = new PleasantProgress();

    // Output stream
    this.actualOuputStream = options.outputStream;
    this.outputStream = through(function(data) {
      pleasantProgress.stop(true);
      this.emit('data', data);
    });

    this.outputStream.setMaxListeners(0);
    this.outputStream.pipe(this.actualOuputStream);

    // Input stream
    this.inputStream = options.inputStream;

    this.writeLevel = options.writeLevel || 'INFO';
    this.ci = !!options.ci;
  }

  write(data, writeLevel) {
    if (this.writeLevelVisible(writeLevel)) {
      this.outputStream.write(data);
    }
  }

  writeLine(data, writeLevel) {
    if (this.writeLevelVisible(writeLevel)) {
      this.write(data + EOL);
    }
  }

  writeError(error) {
    writeError(this, error);
  }

  setWriteLevel(level) {
    if (Object.keys(WRITE_LEVELS).indexOf(level) === -1) {
      throw new Error('Unknown write level. Valid values are \'DEBUG\', \'INFO\', \'WARNING\', and \'ERROR\'.');
    }

    this.writeLevel = level;
  }


  writeLevelVisible(writeLevel) {
    const levels = WRITE_LEVELS;
    writeLevel = writeLevel || 'INFO';
    return levels[writeLevel] >= levels[this.writeLevel];
  }

  startProgress(message, stepString) {
    if (this.writeLevelVisible('INFO')) {
      if (this.ci) {
        this.writeLine(message);
      } else {
        this.pleasantProgress.start(message, stepString);
      }
    }
  }

  stopProgress(printWithFullStepString) {
    if (this.writeLevelVisible('INFO') && !this.ci) {
      this.pleasantProgress.stop(printWithFullStepString);
    }
  }
}
