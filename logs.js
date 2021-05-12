const Chalk = require("chalk");
const chalk = new Chalk.Instance({ level: 2 });
const log = {
  error: (errorMessage) => {
    console.log(
      chalk.red(chalk.bgWhite("ERROR!:  " + errorMessage.toUpperCase()))
    );
  },
  warning: (warningMessage) => {
    console.log(
      chalk.yellow(chalk.bgBlack("WARNING:  " + warningMessage.toUpperCase()))
    );
  },
  info: (infoMessage) => {
/*     if (IgnoreWarnings)
 */      console.log(
        chalk.blue(chalk.bgBlack("INFO:  " + infoMessage.toUpperCase()))
      );
  },
};

module.exports = {log}
