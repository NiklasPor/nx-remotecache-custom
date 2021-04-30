import { RemoteCache } from "@nrwl/workspace/src/tasks-runner/default-tasks-runner";
import { SafeRemoteCacheImplementation } from "./types/safe-remote-cache-implementation";
export declare const createRemoteCacheStore: (safeImplementation: Promise<SafeRemoteCacheImplementation | null>) => RemoteCache["store"];
