import { PluginBuild, Plugin } from "esbuild";

import {
    createHttpServer,
    HttpServerConfig,
    HttpServer,
    closeHttpServer,
    getListenData
} from "./http";
import logger from "../../logger";

type Config = {
    server?: HttpServerConfig;
    exitListener?: boolean;
};
export class Server implements Plugin {
    readonly name = "http";
    private http?: HttpServer;

    setup(build: PluginBuild): void {
        const outDir = build.initialOptions.outdir;
        if (!outDir)
            throw new Error(
                "The esbuild http plugin requires an outdir to be set."
            );
        this.http = createHttpServer(this.config.server || {}, outDir);

        const { host, port } = getListenData(this.http);
        logger.info(`Listening on ${host}:${port}`);

        build.onEnd((result) => {
            if (result) {
                for (const warning in result.warnings) {
                    logger.warn(warning);
                }
            }

            if (result.errors) {
                result.errors.forEach((e) =>
                    logger.error(`esbuild error: ${e.text}: `)
                );
            } else if (this.http) {
                this.http.reload();
            }
        });

        if (this.config.exitListener ?? true) {
            this.setupExitListener();
        }
    }

    constructor(public readonly config: Config = {}) {}

    async stop(): Promise<void> {
        if (this.http) {
            await closeHttpServer(this.http);
            this.http = undefined;
        }
    }

    private setupExitListener() {
        process.on("SIGTERM", () => {
            this.stop(); // best effort
        });
    }
}
