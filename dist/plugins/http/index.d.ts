import { PluginBuild, Plugin } from "esbuild";
import { HttpServerConfig } from "./http";
declare type Config = {
    server?: HttpServerConfig;
    exitListener?: boolean;
};
export declare class Server implements Plugin {
    readonly config: Config;
    readonly name = "http";
    private http?;
    setup(build: PluginBuild): void;
    constructor(config?: Config);
    stop(): Promise<void>;
    private setupExitListener;
}
export {};
