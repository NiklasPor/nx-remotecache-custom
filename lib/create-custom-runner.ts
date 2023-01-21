import { RemoteCache } from "@nrwl/workspace/src/tasks-runner/default-tasks-runner";
import defaultTasksRunner from "@nrwl/workspace/tasks-runners/default";
import { createRemoteCacheRetrieve } from "./create-remote-cache-retrieve";
import { createRemoteCacheStore } from "./create-remote-cache-store";
import { getSafeRemoteCacheImplementation } from "./get-safe-remote-cache-implementation";
import { CustomRunnerOptions } from "./types/custom-runner-options";
import { RemoteCacheImplementation } from "./types/remote-cache-implementation";

type DefaultTasksRunner = typeof defaultTasksRunner;

const getReadWriteDisabledStatus = (
  options: CustomRunnerOptions
): [boolean, boolean] => {
  const mode = process.env.NXCACHE_MODE || options.mode;
  if (!options.silent) {
    console.info(`Running runner with remoteCache mode: ${mode}`);
  }
  switch (mode) {
    case "disabled":
      return [true, true];
    case "read-only":
      return [false, true];
    case "write-only":
      return [true, false];
    case "read-write":
    case undefined:
      return [false, false];
    default:
      console.warn(
        `Unknown mode configured, falling back to 'read-write': '${mode}'`
      );
      return [false, false];
  }
};

const createRemoteCache = (
  implementation: Promise<RemoteCacheImplementation>,
  options: CustomRunnerOptions
): RemoteCache => {
  const safeImplementation = getSafeRemoteCacheImplementation(
    implementation,
    options
  );
  const [readDisabled, writeDisabled] = getReadWriteDisabledStatus(options);

  return {
    retrieve: createRemoteCacheRetrieve(safeImplementation, readDisabled),
    store: createRemoteCacheStore(safeImplementation, writeDisabled),
  };
};

export const createCustomRunner = <T extends Object>(
  setup: (options: CustomRunnerOptions<T>) => Promise<RemoteCacheImplementation>
): DefaultTasksRunner => (tasks, options, context) =>
  defaultTasksRunner(
    tasks,
    {
      ...options,
      remoteCache: createRemoteCache(
        setup(options as CustomRunnerOptions<T>),
        options
      ),
    },
    context
  );
