import { RemoteCache } from "@nrwl/workspace/src/tasks-runner/default-tasks-runner";
import { Readable } from "stream";
import { create } from "tar";
import { getFileNameFromHash } from "./get-file-name-from-hash";
import { SafeRemoteCacheImplementation } from "./types/safe-remote-cache-implementation";

const archiveFolder = (cwd: string, folder: string): Readable =>
  Readable.from(create({ gzip: true, C: cwd }, [folder]));

export const createRemoteCacheStore = (
  safeImplementation: Promise<SafeRemoteCacheImplementation | null>,
  disabled: boolean,
): RemoteCache["store"] => async (hash, cacheDirectory) => {
  if (disabled) {
    return false;
  }
  const implementation = await safeImplementation;

  if (!implementation) {
    return false;
  }

  const file = getFileNameFromHash(hash);
  const { storeFile } = implementation;
  const stream = archiveFolder(cacheDirectory, hash);

  await storeFile(file, stream);

  return true;
};
