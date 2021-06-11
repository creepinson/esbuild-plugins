import { BuildOptions as EsbuildOptions, build, BuildResult } from 'esbuild';

import createServer, { ServerOptions } from './server';
import logger from './logger';

// Contains required properties and forces some defaults.
interface BuildOptions extends EsbuildOptions {
  outdir: string;
  outfile: undefined;
}

type Options = {
  build?: BuildOptions;
  server?: ServerOptions;
};

export default function start(options: Options): Promise<BuildResult> {
  const server = createServer(options.server || {});

  return build({
    ...options,
    write: true, // BrowserSync requires the files on disk
    watch: {
      onRebuild(error, result) {
        if (result) {
          for (const warning in result.warnings) {
            logger.warn(warning);
          }
        }

        if (error) {
          logger.error(error);
        } else {
          server.reload();
        }
      }
    }
  });
}
