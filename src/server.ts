import browserSync, {
  BrowserSyncInstance,
  Options,
  ProxyOptions
} from 'browser-sync';

export type ServerOptions = {
  host?: string;
  port?: number;
  proxy?: ProxyOptions;
  https?: boolean;
  httpModule?: string;
  browser?: string | string[];
  openBrowser?: boolean;
};

const DEFAULT_PORT = 3000;

const defaults: ServerOptions = {
  port: DEFAULT_PORT
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

export default function create(options: ServerOptions): BrowserSyncInstance {
  const bs = browserSync.create();
  bs.init({
    ...defaults,
    ...options,
    ...bsOverrides
  });

  return bs;
}
