import { DefaultTasksRunnerOptions } from "@nrwl/workspace/src/tasks-runner/default-tasks-runner";
export declare type CustomRunnerOptions<T extends Object = Object> = T & DefaultTasksRunnerOptions & {
    verbose?: boolean;
};
