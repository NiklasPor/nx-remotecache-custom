import * as log from "./log";
import { CustomRunnerOptions } from "./types/custom-runner-options";
import { RemoteCacheImplementation } from "./types/remote-cache-implementation";
import { SafeRemoteCacheImplementation } from "./types/safe-remote-cache-implementation";

const attachLogsToFileOperation = <T, OtherArgs extends unknown[]>({
  operation,
  success,
  failure,
  verbose,
}: {
  operation: (filename: string, ...args: OtherArgs) => Promise<T>;
  success?: (filename: string) => void;
  failure: (filename: string, error: unknown) => void;
  verbose: boolean;
}): ((filename: string, ...args: OtherArgs) => Promise<T | null>) => async (
  filename,
  ...args
) => {
  try {
    const result = await operation(filename, ...args);

    success?.(filename);

    return result;
  } catch (error) {
    failure(filename, error);

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

  try {
    const implementation = await implementationPromise;
    const { name, fileExists, storeFile, retrieveFile } = implementation;

    return {
      name,
      retrieveFile: attachLogsToFileOperation({
        operation: retrieveFile,
        success: (filename) => log.retrieveSuccess(implementation, filename),
        failure: (filename, error) =>
          log.retrieveFailure(implementation, filename, error),
        verbose,
      }),
      storeFile: attachLogsToFileOperation({
        operation: storeFile,
        success: (filename) => log.storeSuccess(implementation, filename),
        failure: (filename, error) =>
          log.storeFailure(implementation, filename, error),
        verbose,
      }),
      fileExists: attachLogsToFileOperation({
        operation: fileExists,
        failure: (filename, error) =>
          log.checkFailure(implementation, filename, error),
        verbose,
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
