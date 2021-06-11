import chalk from 'chalk';

type Logger = (message: string | Error) => void;

function createLogger(prefix: string): Logger {
  return (message) => {
    console.log(`${prefix} ${message}`);
  };
}

export default {
  info: createLogger(chalk.bgBlue.bold('info')),
  warn: createLogger(chalk.bgYellow.bold('warn')),
  error: createLogger(chalk.bgRedBright.bold('error'))
};
