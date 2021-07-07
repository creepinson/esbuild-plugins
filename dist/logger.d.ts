declare type Logger = (message: string | Error) => void;
declare const _default: {
    info: Logger;
    warn: Logger;
    error: Logger;
};
export default _default;
