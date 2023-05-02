import { RemoteCache } from "@nx/workspace/src/tasks-runner/default-tasks-runner";
import defaultTasksRunner from "@nx/workspace/tasks-runners/default";
import { createRemoteCacheRetrieve } from "./create-remote-cache-retrieve";
import { createRemoteCacheStore } from "./create-remote-cache-store";
import { getSafeRemoteCacheImplementation } from "./get-safe-remote-cache-implementation";
import { CustomRunnerOptions } from "./types/custom-runner-options";
import { RemoteCacheImplementation } from "./types/remote-cache-implementation";

type DefaultTasksRunner = typeof defaultTasksRunner;

const createRemoteCache = (
  implementation: Promise<RemoteCacheImplementation>,
  options: CustomRunnerOptions
): RemoteCache => {
  const safeImplementation = getSafeRemoteCacheImplementation(
    implementation,
    options
  );

  return {
    retrieve: createRemoteCacheRetrieve(safeImplementation),
    store: createRemoteCacheStore(safeImplementation),
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
