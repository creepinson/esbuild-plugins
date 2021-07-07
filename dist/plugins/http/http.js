import { promisify } from "util";
import browserSync from "browser-sync";
const defaultConfig = {
    host: "0.0.0.0",
    port: 8080
};
const bsOverrides = {
    ui: false,
    watch: false,
    logLevel: "silent",
    notify: false,
    ghostMode: false,
    // Disable "complex" features, we want to serve the output
    // directory of esbuild and no more.
    plugins: [],
    middleware: [],
    serveStatic: [],
    rewriteRules: [],
    // Disable online services
    tunnel: false,
    online: false
};
export function createHttpServer(config, serveDir) {
    const server = browserSync.create();
    server.init({
        // TODO Specify serve directory
        ...defaultConfig,
        ...config,
        server: serveDir,
        ...bsOverrides
    });
    return server;
}
export function getListenData(server) {
    return {
        host: server.getOption("host"),
        port: server.getOption("port")
    };
}
export async function closeHttpServer(server) {
    await promisify(server.cleanup)();
}
