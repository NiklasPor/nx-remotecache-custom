import { DefaultTasksRunnerOptions } from "@nrwl/workspace/src/tasks-runner/default-tasks-runner";

export type CustomRunnerOptions<T extends Object = Object> = T &
  DefaultTasksRunnerOptions & {
    /**
     * Sets verbose error logging for `nx-remotecache-custom`
     */
    verbose?: boolean;
    /**
     * Hide success and info logs. Only display warning and error logs.
     */
    silent?: boolean;
    /**
     * Enables / disables reading `.env` files into the `proces.env`.
     *
     * @default true
     */
    dotenv?: boolean;
    /**
     * Path to folder containing `.env` files. Optional.
     */
    dotenvPath?: string;
  };
