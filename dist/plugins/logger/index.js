import ora from "ora";
const buildSpinner = ora({
    color: "magenta"
});
export const buildSpinnerPlugin = {
    name: "buildSpinner",
    setup(build) {
        build.onStart(() => {
            buildSpinner.start("Rebuilding...");
        });
        build.onEnd((result) => {
            if (result.errors.length > 0) {
                buildSpinner.clear();
            }
            else {
                buildSpinner.succeed("Built!");
            }
        });
    }
};
