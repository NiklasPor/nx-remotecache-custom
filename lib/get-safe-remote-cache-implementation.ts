import * as log from "./log";
import { CustomRunnerOptions } from "./types/custom-runner-options";
import { RemoteCacheImplementation } from "./types/remote-cache-implementation";
import { SafeRemoteCacheImplementation } from "./types/safe-remote-cache-implementation";

const attachLogsToFileOperation =
  <T, OtherArgs extends unknown[]>({
    operation,
    success,
    failure,
    verbose,
    silent,
    errors,
  }: {
    operation: (filename: string, ...args: OtherArgs) => Promise<T>;
    success?: (filename: string) => void;
    failure: (filename: string, error: unknown) => void;
    verbose: boolean;
    silent: boolean;
    errors: boolean;
  }): ((filename: string, ...args: OtherArgs) => Promise<T | null>) =>
  async (filename, ...args) => {
    try {
      const result = await operation(filename, ...args);

      if (!silent) {
        success?.(filename);
      }

      return result;
    } catch (error) {
      if (!errors) {
        failure(filename, error);
      }

      if (verbose) {
        console.error(error);
      }

      return null;
    }
  };

export const getSafeRemoteCacheImplementation = async (
  implementationPromise: Promise<RemoteCacheImplementation>,
  options: CustomRunnerOptions
): Promise<SafeRemoteCacheImplementation | null> => {
  const verbose = !!options.verbose;
  const silent = !!options.silent;
  const errors = !!options.errors;

  try {
    const implementation = await implementationPromise;
    const { fileExists, storeFile, retrieveFile } = implementation;
    const name =
      process.env.NX_CACHE_NAME || options.name || implementation.name;

    return {
      name,
      retrieveFile: attachLogsToFileOperation({
        operation: retrieveFile,
        success: (filename) => log.retrieveSuccess(implementation, filename),
        failure: (filename, error) =>
          log.retrieveFailure(implementation, filename, error),
        verbose,
        silent,
        errors,
      }),
      storeFile: attachLogsToFileOperation({
        operation: storeFile,
        success: (filename) => log.storeSuccess(implementation, filename),
        failure: (filename, error) =>
          log.storeFailure(implementation, filename, error),
        verbose,
        silent,
        errors,
      }),
      fileExists: attachLogsToFileOperation({
        operation: fileExists,
        failure: (filename, error) =>
          log.checkFailure(implementation, filename, error),
        verbose,
        silent,
        errors,
      }),
    };
  } catch (error) {
    log.setupFailure(error);

    if (verbose) {
      console.error(error);
    }

    return null;
  }
};
