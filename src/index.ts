import { build, BuildOptions } from 'esbuild';

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

export class Server {
  private http?: HttpServer;
  private stopBuild?: () => void;
  constructor(private config: Config) {}

  async start(): Promise<void> {
    const outDir = this.config.build?.outdir;
    this.http = createHttpServer(this.config.server || {}, outDir);

    const { host, port } = getListenData(this.http);
    logger.info(`Listening on ${host}:${port}`);

    const data = await build({
      ...this.config.build,
      write: true, // browser-sync reads the files from disk
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
    this.stopBuild = data.stop;

    if (this.config.exitListener ?? true) {
      this.setupExitListener();
    }
  }

  async stop(): Promise<void> {
    this.stopBuild?.();
    this.stopBuild = undefined;

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
