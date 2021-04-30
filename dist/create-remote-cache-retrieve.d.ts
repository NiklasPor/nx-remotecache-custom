import { RemoteCache } from "@nrwl/workspace/src/tasks-runner/default-tasks-runner";
import { SafeRemoteCacheImplementation } from "./types/safe-remote-cache-implementation";
export declare const createRemoteCacheRetrieve: (safeImplementation: Promise<SafeRemoteCacheImplementation | null>) => RemoteCache["retrieve"];
