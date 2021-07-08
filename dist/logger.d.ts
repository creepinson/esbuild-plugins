export declare type LogFunction = (message: string | Error) => void;
export declare type LogLevel = "info" | "warn" | "error";
export declare type Logger<K extends string = LogLevel> = {
    [key in K]: LogFunction;
};
export interface LoggerOptions {
    createMessage: (level: string, message: string | Error) => string;
    base: {
        log: LogFunction;
    };
    levels?: string[];
}
export declare type CreateLoggerFunction<K extends LogLevel = LogLevel, T = LoggerOptions> = (opts: T) => Logger<K>;
export declare const createLogger: <K extends string = LogLevel>(options: LoggerOptions) => Logger<K>;
/**
 * Prefixes each log message with a prefix and a color-coded log level.
 */
export declare const basicLogger: <K extends string = LogLevel>(opts: {
    createPrefix: (level: string, message: string | Error) => string;
    levels?: LoggerOptions["levels"];
    base: LoggerOptions["base"];
}) => Logger<K>;
