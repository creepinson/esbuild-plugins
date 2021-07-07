import { createHttpServer, closeHttpServer, getListenData } from "./http";
import logger from "../../logger";
export class Server {
    constructor(config = {}) {
        this.config = config;
        this.name = "http";
    }
    setup(build) {
        const outDir = build.initialOptions.outdir;
        if (!outDir)
            throw new Error("The esbuild http plugin requires an outdir to be set.");
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
                result.errors.forEach((e) => logger.error(`esbuild error: ${e.text}: `));
            }
            else if (this.http) {
                this.http.reload();
            }
        });
        if (this.config.exitListener ?? true) {
            this.setupExitListener();
        }
    }
    async stop() {
        if (this.http) {
            await closeHttpServer(this.http);
            this.http = undefined;
        }
    }
    setupExitListener() {
        process.on("SIGTERM", () => {
            this.stop(); // best effort
        });
    }
}
