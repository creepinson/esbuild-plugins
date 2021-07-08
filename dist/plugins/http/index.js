import { createHttpServer, closeHttpServer, getListenData } from "./http.js";
import logger from "../../logger.js";
export const httpServerPlugin = (config) => ({
    name: "http",
    setup: (build) => {
        let http;
        const outDir = build.initialOptions.outdir;
        if (!outDir)
            throw new Error("The esbuild http plugin requires an outdir to be set.");
        http = createHttpServer(config.server || {}, outDir);
        const { host, port } = getListenData(http);
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
            else if (http) {
                http.reload();
            }
        });
        const stop = async () => {
            if (http) {
                await closeHttpServer(http);
                http = undefined;
            }
        };
        const setupExitListener = () => process.on("SIGTERM", () => {
            stop(); // best effort
        });
        if (config.exitListener ?? true) {
            setupExitListener();
        }
    }
});
