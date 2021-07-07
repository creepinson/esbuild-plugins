import chalk from "chalk";
const createLogger = (prefix) => (message) => {
    console.log(`${prefix} ${message}`);
};
export default {
    info: createLogger(chalk.bgHex("#3d33e5").bold("info")),
    warn: createLogger(chalk.bgYellow.bold("warn")),
    error: createLogger(chalk.bgRedBright.bold("error"))
};
