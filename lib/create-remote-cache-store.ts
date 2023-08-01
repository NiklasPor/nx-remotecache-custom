import { RemoteCache } from "@nx/workspace/src/tasks-runner/default-tasks-runner";
import { Readable } from "stream";
import { create } from "tar";
import { getFileNameFromHash } from "./get-file-name-from-hash";
import { SafeRemoteCacheImplementation } from "./types/safe-remote-cache-implementation";
import { filterMachineId } from "./filter-machine-id";

const archiveFolder = (cwd: string, folder: string): Readable =>
  Readable.from(create({ gzip: true, C: cwd, filter: filterMachineId }, [folder]));

export const createRemoteCacheStore = (
  safeImplementation: Promise<SafeRemoteCacheImplementation | null>
): RemoteCache["store"] => async (hash, cacheDirectory) => {
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
