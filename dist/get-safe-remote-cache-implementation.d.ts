import { CustomRunnerOptions } from "./types/custom-runner-options";
import { RemoteCacheImplementation } from "./types/remote-cache-implementation";
import { SafeRemoteCacheImplementation } from "./types/safe-remote-cache-implementation";
export declare const getSafeRemoteCacheImplementation: (implementationPromise: Promise<RemoteCacheImplementation>, options: CustomRunnerOptions) => Promise<SafeRemoteCacheImplementation | null>;
