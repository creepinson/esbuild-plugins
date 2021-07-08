import chalk from "chalk";
export const createLogger = (options) => {
    const fn = (type) => (message) => options.base.log(options.createMessage(type, message));
    if (!options.levels)
        options.levels = ["info", "error", "warn"];
    return options.levels?.reduce((acc, cur) => {
        acc[cur] = fn(cur);
        return acc;
    }, {});
};
/**
 * Prefixes each log message with a prefix and a color-coded log level.
 */
export const basicLogger = (opts) => {
    const createMessage = (level, message) => {
        /**
         * Creates the message with the color and the prefix
         */
        const msg = (color) => `[${color(level)}] ${opts.createPrefix(level, message)} > ${message}`;
        // Chooses the prefix color depending on the level
        switch (level) {
            default:
                return msg(chalk.hex("#3d33e5").bold);
            case "warn":
                return msg(chalk.yellow.bold);
            case "error":
                return msg(chalk.redBright.bold);
        }
    };
    return createLogger({
        base: opts.base,
        levels: opts.levels,
        createMessage
    });
};
/*
    info: chalk.hex("#3d33e5").bold("info"),
    warn: createLogger(opts)(chalk.yellow.bold("warn")),
    error: createLogger(opts)(chalk.redBright.bold("error"))
 */
