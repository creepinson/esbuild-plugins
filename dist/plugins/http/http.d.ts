import { ProxyOptions, BrowserSyncInstance } from "browser-sync";
export declare type HttpServerConfig = {
    host?: string;
    port?: number;
    proxy?: ProxyOptions;
    https?: boolean;
    httpModule?: string;
    browser?: string | string[];
    openBrowser?: boolean;
};
export declare type HttpServer = BrowserSyncInstance;
export declare function createHttpServer(config: HttpServerConfig, serveDir: string): HttpServer;
declare type HttpServerListenData = {
    host: string;
    port: number;
};
export declare function getListenData(server: HttpServer): HttpServerListenData;
export declare function closeHttpServer(server: HttpServer): Promise<void>;
export {};
