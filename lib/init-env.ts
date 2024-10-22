import dotenv from "dotenv";
import { workspaceRoot } from "nx/src/utils/workspace-root";
import { CustomRunnerOptions } from "./types/custom-runner-options";
/**
 * Initializes the environment variables.
 */
export const initEnv = (options: CustomRunnerOptions) => {
  if (options.dotenv !== false) {
    const dotenvConfig = {
      path: options.dotenvPath?.replace("{workspaceRoot}", workspaceRoot),
    };
    console.log("🍕 dotenv config", dotenvConfig);
    dotenv.config(dotenvConfig);
  }
};
