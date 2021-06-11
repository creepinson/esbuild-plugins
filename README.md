# esbuild-http-server

Serves the output of esbuild, refreshing the browser on rebuilds.

## Example

```ts
import { Server } from '@hugmanrique/esbuild-http-server';

const server = new Server({
  build: {
    entryPoints: ['src/index.html'],
    outdir: './dist'
  }
});

await server.start();
```

The current code is quite dirty and should be refactored to a [esbuild plugin](https://esbuild.github.io/plugins/#using-plugins).

## License

[MIT](LICENSE) &copy; [Hugo Manrique](https://hugmanrique.me)