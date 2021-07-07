import { BuildResult, Plugin, PluginBuild } from "esbuild";
import ora from "ora";

const buildSpinner = ora({
    color: "magenta"
});

export const buildSpinnerPlugin: Plugin = {
    name: "buildSpinner",
    setup(build: PluginBuild): void {
        build.onStart(() => {
            buildSpinner.start("Rebuilding...");
        });
        build.onEnd((result: BuildResult) => {
            if (result.errors.length > 0) {
                buildSpinner.clear();
            } else {
                buildSpinner.succeed("Built!");
            }
        });
    }
};
