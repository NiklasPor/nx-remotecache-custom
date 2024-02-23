// Re-export types here to avoid needing to update "private" paths everywhere

import { Task } from "nx/src/config/task-graph";
import type {
  DefaultTasksRunnerOptions,
  RemoteCache,
} from "nx/src/tasks-runner/default-tasks-runner";

export type NxDefaultTasksRunnerOptions = DefaultTasksRunnerOptions;
export type NxRemoteCache = RemoteCache;
export type NxTask = Task;
