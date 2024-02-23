import defaultTasksRunner from "nx/tasks-runners/default";
import { createRemoteCacheRetrieve } from "./create-remote-cache-retrieve";
import { createRemoteCacheStore } from "./create-remote-cache-store";
import { getSafeRemoteCacheImplementation } from "./get-safe-remote-cache-implementation";
import * as log from "./log";
import { CustomRunnerOptions } from "./types/custom-runner-options";
import { NxRemoteCache, NxTask } from "./types/nx";
import { RemoteCacheImplementation } from "./types/remote-cache-implementation";

type DefaultTasksRunner = typeof defaultTasksRunner;

const cacheNoop = async () => false;

const createRemoteCache = (
  implementation: Promise<RemoteCacheImplementation>,
  options: CustomRunnerOptions
): NxRemoteCache => {
  const read = process.env.NXCACHE_READ
    ? process.env.NXCACHE_READ !== "false"
    : options.read ?? true;
  const write = process.env.NXCACHE_WRITE
    ? process.env.NXCACHE_WRITE !== "false"
    : options.write ?? true;

  // Do not even create the cache if both read and write are disabled
  if (!read && !write) {
    return {
      retrieve: cacheNoop,
      store: cacheNoop,
    };
  }

  const safeImplementation = getSafeRemoteCacheImplementation(
    implementation,
    options
  );

  if (options.verbose) {
    log.cacheCreated({ read, write });
  }

  return {
    retrieve: read ? createRemoteCacheRetrieve(safeImplementation) : cacheNoop,
    store: write ? createRemoteCacheStore(safeImplementation) : cacheNoop,
  };
};

export const createCustomRunner =
  <T extends Object>(
    setup: (
      options: CustomRunnerOptions<T>,
      tasks: NxTask[]
    ) => Promise<RemoteCacheImplementation>
  ): DefaultTasksRunner =>
  (tasks, options, context) =>
    defaultTasksRunner(
      tasks,
      {
        ...options,
        remoteCache: createRemoteCache(
          setup(options as CustomRunnerOptions<T>, tasks),
          options
        ),
      },
      context
    );
