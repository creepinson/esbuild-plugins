import { Plugin } from "esbuild";
import { HttpServerConfig } from "./http.js";
export declare type HttpConfig = {
    server?: HttpServerConfig;
    exitListener?: boolean;
};
export declare const httpServerPlugin: (config: HttpConfig) => Plugin;
