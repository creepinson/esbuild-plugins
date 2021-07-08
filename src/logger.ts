import chalk from "chalk";

// TODO: move this file to @firenodes/logger
export type LogFunction = (message: string | Error) => void;
export type LogLevel = "info" | "warn" | "error";
export type Logger<K extends string = LogLevel> = {
    [key in K]: LogFunction;
};
export interface LoggerOptions {
    createMessage: (level: string, message: string | Error) => string;
    base: { log: LogFunction };
    levels?: string[];
}
export type CreateLoggerFunction<
    K extends LogLevel = LogLevel,
    T = LoggerOptions
> = (opts: T) => Logger<K>;

export const createLogger = <K extends string = LogLevel>(
    options: LoggerOptions
): Logger<K> => {
    const fn = (type: string) => (message: string | Error) =>
        options.base.log(options.createMessage(type, message));

    if (!options.levels) options.levels = ["info", "error", "warn"];

    return options.levels?.reduce((acc: Logger<string>, cur) => {
        acc[cur] = fn(cur);
        return acc;
    }, {}) as Logger<K>;
};

/**
 * Prefixes each log message with a prefix and a color-coded log level.
 */
export const basicLogger = <K extends string = LogLevel>(opts: {
    createPrefix: (level: string, message: string | Error) => string;
    levels?: LoggerOptions["levels"];
    base: LoggerOptions["base"];
}): Logger<K> => {
    const createMessage = (level: string, message: string | Error) => {
        /**
         * Creates the message with the color and the prefix
         */
        const msg = (color: (inType: string) => string): string =>
            `[${color(level)}] ${opts.createPrefix(
                level,
                message
            )} > ${message}`;

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

    return createLogger<K>({
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
