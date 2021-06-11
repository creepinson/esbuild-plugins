import { promisify } from 'util';
import browserSync, {
  ProxyOptions,
  Options,
  BrowserSyncInstance
} from 'browser-sync';

export type HttpServerConfig = {
  host?: string;
  port?: number;
  proxy?: ProxyOptions;
  https?: boolean;
  httpModule?: string; // TODO remove?
  browser?: string | string[];
  openBrowser?: boolean;
};

const defaultConfig: HttpServerConfig = {
  host: '0.0.0.0', // listen on all interfaces
  port: 8080
};

const bsOverrides: Options = {
  ui: false, // disable BrowserSync interface
  watch: false, // we request reloads manually
  logLevel: 'silent', // disable "Reloading Browsers" spam
  notify: false, // remove popover on refresh
  ghostMode: false, // don't mirror device events

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

export type HttpServer = BrowserSyncInstance;

export function createHttpServer(
  config: HttpServerConfig,
  serveDir: string
): HttpServer {
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

type HttpServerListenData = {
  host: string;
  port: number;
};

export function getListenData(server: HttpServer): HttpServerListenData {
  return {
    host: server.getOption('host'),
    port: server.getOption('port')
  };
}

export async function closeHttpServer(server: HttpServer): Promise<void> {
  await promisify(server.cleanup)();
}
