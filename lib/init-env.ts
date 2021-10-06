import dotenv from "dotenv";
import { CustomRunnerOptions } from "./types/custom-runner-options";

/**
 * Initializes the environment variables.
 */
export const initEnv = (options: CustomRunnerOptions) => {
  if (options.dotenv !== false) {
    dotenv.config({ path: options.dotenvPath });
  }
};
