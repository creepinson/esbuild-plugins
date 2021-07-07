import { BuildResult, Plugin, PluginBuild } from "esbuild";
import chalk from "chalk";
import ora from "ora";

// TODO: @firenodes/core logger
type Logger = (message: string | Error) => void;

const createLogger =
    (prefix: string): Logger =>
    (message) => {
        console.log(`${prefix} ${message}`);
    };

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

export default {
    info: createLogger(chalk.bgHex("#3d33e5").bold("info")),
    warn: createLogger(chalk.bgYellow.bold("warn")),
    error: createLogger(chalk.bgRedBright.bold("error"))
};
