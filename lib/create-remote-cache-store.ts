import { Readable } from "stream";
import { create } from "tar";
import { createFilterSourceFile } from "./create-filter-source-file";
import { getFileNameFromHash } from "./get-file-name-from-hash";
import { NxRemoteCache } from "./types/nx";
import { SafeRemoteCacheImplementation } from "./types/safe-remote-cache-implementation";

const archiveFolder = (cwd: string, hash: string): Readable =>
  Readable.from(
    create({ gzip: true, C: cwd, filter: createFilterSourceFile(hash) }, [hash])
  );

export const createRemoteCacheStore =
  (
    safeImplementation: Promise<SafeRemoteCacheImplementation | null>
  ): NxRemoteCache["store"] =>
  async (hash, cacheDirectory) => {
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
