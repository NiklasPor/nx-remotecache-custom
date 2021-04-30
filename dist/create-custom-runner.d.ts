import defaultTasksRunner from "@nrwl/workspace/tasks-runners/default";
import { CustomRunnerOptions } from "./types/custom-runner-options";
import { RemoteCacheImplementation } from "./types/remote-cache-implementation";
declare type DefaultTasksRunner = typeof defaultTasksRunner;
export declare const createCustomRunner: <T extends Object>(setup: (options: CustomRunnerOptions<T>) => Promise<RemoteCacheImplementation>) => DefaultTasksRunner;
export {};
