import esbuild, { build, BuildOptions, BuildResult, Plugin } from 'esbuild';
import htmlPlugin from '@chialab/esbuild-plugin-html';

import {
  createHttpServer,
  HttpServerConfig,
  HttpServer,
  closeHttpServer,
  getListenData
} from './http';
import logger from './logger';

type BuildConfig = BuildOptions & {
  outdir: string;
  outfile: undefined;
};

type Config = {
  build: BuildConfig;
  server?: HttpServerConfig;
  exitListener?: boolean;
};

const defaultPlugins: Plugin[] = [
  logger.buildSpinnerPlugin,
  htmlPlugin({ esbuild })
];

export class Server {
  private http?: HttpServer;
  private build?: BuildResult;
  constructor(private config: Config) {}

  async start(): Promise<void> {
    const outDir = this.config.build?.outdir;
    this.http = createHttpServer(this.config.server || {}, outDir);

    const { host, port } = getListenData(this.http);
    logger.info(`Listening on ${host}:${port}`);

    this.build = await build({
      ...this.config.build,
      write: true, // browser-sync reads the files from disk
      incremental: true, // speeds up builds
      plugins: [...(this.config.build.plugins ?? []), ...defaultPlugins],
      watch: {
        onRebuild: (error, result) => {
          if (result) {
            for (const warning in result.warnings) {
              logger.warn(warning);
            }
          }

          if (error) {
            logger.error(error);
          } else if (this.http) {
            this.http.reload();
          }
        }
      }
    });

    if (this.config.exitListener ?? true) {
      this.setupExitListener();
    }
  }

  async stop(): Promise<void> {
    this.build?.stop?.();
    this.build = undefined;

    if (this.http) {
      await closeHttpServer(this.http);
      this.http = undefined;
    }
  }

  private setupExitListener() {
    process.on('SIGTERM', () => {
      this.stop(); // best effort
    });
  }
}
